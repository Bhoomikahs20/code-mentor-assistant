"""routes/feedback.py – Get detailed feedback for a completed job (sync)"""
from __future__ import annotations
import logging

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.submission import Submission

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/feedback", tags=["feedback"])


@router.get("/{job_id}")
def get_feedback(job_id: str, db: Session = Depends(get_db)):
    """Return the complete structured feedback for a completed job."""
    sub = db.query(Submission).filter(Submission.id == job_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Job not found.")

    if sub.status == "processing":
        return {"job_id": job_id, "status": "processing", "message": "Analysis in progress. Please poll again."}

    if sub.status == "failed":
        return {"job_id": job_id, "status": "failed", "message": "Analysis failed. Please resubmit."}

    return {
        "job_id": job_id,
        "status": "completed",
        "language": sub.language,
        "feedback": sub.feedback,
        "confidence_score": sub.confidence_score,
        "created_at": sub.created_at.isoformat(),
        "completed_at": sub.completed_at.isoformat() if sub.completed_at else None,
    }
