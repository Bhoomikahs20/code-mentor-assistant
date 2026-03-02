"""routes/analytics.py – User performance analytics dashboard (sync)"""
from __future__ import annotations
import logging

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.submission import Submission
from app.services.pattern_service import get_concept_breakdown, get_top_concepts
from app.utils.helpers import calculate_streak, calculate_improvement

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/dashboard/{user_id}")
def get_dashboard(user_id: str, db: Session = Depends(get_db)):
    """Full analytics dashboard for a user."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    submissions = (
        db.query(Submission)
        .filter(Submission.user_id == user_id)
        .order_by(Submission.created_at.asc())
        .all()
    )

    concept_breakdown = get_concept_breakdown(db, user_id)
    top_concepts = get_top_concepts(db, user_id, limit=5)
    streak = calculate_streak(submissions)
    improvement = calculate_improvement(submissions)

    user.streak = streak
    db.flush()

    return {
        "user_id": user_id,
        "streak": streak,
        "total_submissions": len(submissions),
        "completed_submissions": sum(1 for s in submissions if s.status == "completed"),
        "games_played": 0,
        "improvement_percent": improvement,
        "placement_readiness": round(user.placement_readiness, 1),
        "concept_breakdown": concept_breakdown,
        "top_recurring_concepts": top_concepts,
        "recent_scores": [
            {
                "date": s.created_at.isoformat(),
                "score": s.confidence_score,
                "language": s.language,
            }
            for s in submissions[-10:]
        ],
    }


@router.get("/error-patterns/{user_id}")
def get_error_patterns(user_id: str, db: Session = Depends(get_db)):
    """Detailed error DNA breakdown."""
    breakdown = get_concept_breakdown(db, user_id)
    top = get_top_concepts(db, user_id, limit=10)
    total_errors = sum(breakdown.values())
    enriched = []
    for item in top:
        pct = round((item["frequency"] / total_errors * 100), 1) if total_errors else 0
        enriched.append({**item, "percent": pct})
    return {"user_id": user_id, "total_errors": total_errors, "breakdown": enriched}
