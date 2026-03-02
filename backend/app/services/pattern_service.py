"""
services/pattern_service.py
---------------------------
Track per-user error concept frequency in the DB (sync).
If a concept appears >= 3 times → mark is_recurring = True.
"""
from __future__ import annotations
import logging
from datetime import datetime
from typing import List

from sqlalchemy.orm import Session

from app.models.error_pattern import ErrorPattern

logger = logging.getLogger(__name__)
RECURRING_THRESHOLD = 3


def update_patterns(
    db: Session,
    user_id: str,
    concepts: List[str],
    error_type: str = "logic_error",
) -> bool:
    """
    For each concept: increment frequency or create new record.
    Returns True if ANY concept is now recurring.
    """
    any_recurring = False
    for concept in concepts:
        if not concept:
            continue
        pattern = (
            db.query(ErrorPattern)
            .filter(ErrorPattern.user_id == user_id, ErrorPattern.concept == concept)
            .first()
        )
        if pattern:
            pattern.frequency += 1
            pattern.last_seen = datetime.utcnow()
            pattern.is_recurring = pattern.frequency >= RECURRING_THRESHOLD
            if pattern.is_recurring:
                any_recurring = True
                logger.info("Recurring concept for user %s: %s (freq=%d)", user_id, concept, pattern.frequency)
        else:
            db.add(ErrorPattern(
                user_id=user_id,
                concept=concept,
                error_type=error_type,
                frequency=1,
                is_recurring=False,
            ))
    db.flush()
    return any_recurring


def get_top_concepts(db: Session, user_id: str, limit: int = 5) -> List[dict]:
    """Return the top N most frequent error concepts for a user."""
    patterns = (
        db.query(ErrorPattern)
        .filter(ErrorPattern.user_id == user_id)
        .order_by(ErrorPattern.frequency.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "concept": p.concept,
            "frequency": p.frequency,
            "is_recurring": p.is_recurring,
            "last_seen": p.last_seen.isoformat(),
        }
        for p in patterns
    ]


def get_concept_breakdown(db: Session, user_id: str) -> dict:
    """Return {concept: frequency} dict for analytics dashboard."""
    patterns = db.query(ErrorPattern).filter(ErrorPattern.user_id == user_id).all()
    return {p.concept: p.frequency for p in patterns}
