"""
routes/code.py
--------------
POST /api/code/submit  – Submit code for async analysis
GET  /api/code/status/{job_id} – Poll job status
"""
from __future__ import annotations
import logging
from datetime import datetime

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session

from app.database import get_db, SessionLocal
from app.models.submission import Submission
from app.schemas.submission_schema import CodeSubmitRequest, JobStatusResponse
from app.services.preprocessing import extract_features
from app.services.rag_service import retrieve_context
from app.services.llm_service import analyze_code
from app.services.pattern_service import update_patterns, get_top_concepts
from app.utils.helpers import generate_job_id, build_rag_query

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/code", tags=["code"])


@router.post("/submit", response_model=JobStatusResponse, status_code=202)
async def submit_code(
    payload: CodeSubmitRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """
    Returns job_id immediately. Analysis runs in the background.
    Frontend polls GET /api/code/status/{job_id}.
    """
    if not payload.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty.")
    if len(payload.code) > 50_000:
        raise HTTPException(status_code=400, detail="Code too long (max 50,000 chars).")

    job_id = generate_job_id()
    submission = Submission(
        id=job_id,
        user_id=payload.user_id,
        code=payload.code,
        language=payload.language,
        problem_description=payload.problem_description or "",
        status="processing",
    )
    db.add(submission)
    db.flush()

    background_tasks.add_task(
        _run_analysis,
        job_id=job_id,
        user_id=payload.user_id,
        code=payload.code,
        language=payload.language,
        problem_description=payload.problem_description or "",
    )

    return JobStatusResponse(
        job_id=job_id,
        status="processing",
        created_at=submission.created_at,
    )


@router.get("/status/{job_id}", response_model=JobStatusResponse)
def get_job_status(job_id: str, db: Session = Depends(get_db)):
    """Poll for completion of a code analysis job."""
    submission = db.query(Submission).filter(Submission.id == job_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Job not found.")

    return JobStatusResponse(
        job_id=submission.id,
        status=submission.status,
        feedback=submission.feedback if submission.status == "completed" else None,
        created_at=submission.created_at,
        completed_at=submission.completed_at,
    )


@router.get("/history/{user_id}")
def get_submission_history(user_id: str, limit: int = 10, db: Session = Depends(get_db)):
    """Return recent submissions for a user (without full feedback)."""
    submissions = (
        db.query(Submission)
        .filter(Submission.user_id == user_id)
        .order_by(Submission.created_at.desc())
        .limit(limit)
        .all()
    )
    return {
        "user_id": user_id,
        "submissions": [
            {
                "job_id": s.id,
                "language": s.language,
                "status": s.status,
                "confidence_score": s.confidence_score,
                "created_at": s.created_at.isoformat(),
            }
            for s in submissions
        ],
    }


# ──────────────────────────────────────────────────────────────
# Background analysis worker (runs outside the request cycle)
# Uses its own SessionLocal instance — NOT the request session.
# ──────────────────────────────────────────────────────────────

async def _run_analysis(
    job_id: str,
    user_id: str,
    code: str,
    language: str,
    problem_description: str,
):
    """Full RAG pipeline executed in the background."""
    db = SessionLocal()
    try:
        # ── Step 1: AST feature extraction ──
        features = extract_features(code, language)
        logger.info("Features for job %s: %s", job_id, features.get("suspected_concepts"))

        # ── Step 2: Build RAG query and retrieve context ──
        rag_query = build_rag_query(code, features, problem_description)
        context = await retrieve_context(rag_query, language=language, top_k=4)

        # ── Step 3: Check if any concept is recurring ──
        top = get_top_concepts(db, user_id, limit=10)
        known_concepts = {c["concept"] for c in top}
        suspected = set(features.get("suspected_concepts", []))
        is_recurring = bool(suspected & known_concepts)

        # ── Step 4: LLM analysis ──
        feedback = await analyze_code(
            code=code,
            language=language,
            context=context,
            code_features=features,
            is_recurring=is_recurring,
        )
        feedback["code_features"] = features

        # ── Step 5: Update error patterns ──
        concepts_detected = [e.get("concept", "general") for e in feedback.get("errors", [])]
        if concepts_detected:
            any_recurring = update_patterns(db, user_id, concepts_detected)
            feedback["is_recurring"] = feedback.get("is_recurring") or any_recurring

        # ── Step 6: Persist completed feedback ──
        submission = db.query(Submission).filter(Submission.id == job_id).first()
        if submission:
            submission.status = "completed"
            submission.feedback = feedback
            submission.confidence_score = feedback.get("confidence_score", 0.0)
            submission.completed_at = datetime.utcnow()
        db.commit()
        logger.info("Job %s completed successfully.", job_id)

    except Exception as e:
        db.rollback()
        logger.error("Background analysis failed for job %s: %s", job_id, e, exc_info=True)
        # Mark job as failed
        db2 = SessionLocal()
        try:
            submission = db2.query(Submission).filter(Submission.id == job_id).first()
            if submission:
                submission.status = "failed"
                submission.feedback = {
                    "error": "Analysis failed. Please try again.",
                    "errors": [],
                    "overall_feedback": "The AI analysis encountered an error.",
                    "concepts_to_study": [],
                    "confidence_score": 0.0,
                    "is_recurring": False,
                    "encouraging_message": "Don't give up! Please try submitting again. 🙂",
                }
                submission.completed_at = datetime.utcnow()
            db2.commit()
        except Exception:
            db2.rollback()
        finally:
            db2.close()
    finally:
        db.close()
