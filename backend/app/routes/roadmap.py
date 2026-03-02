"""routes/roadmap.py – Get/regenerate personalized roadmap (sync)"""
from __future__ import annotations
import logging

from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.services.roadmap_service import generate_roadmap, get_latest_roadmap

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/roadmap", tags=["roadmap"])


@router.get("/{user_id}")
async def get_roadmap(
    user_id: str,
    regenerate: bool = Query(False, description="Force regeneration of the roadmap"),
    db: Session = Depends(get_db),
):
    """Return or generate the user's learning roadmap."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    if not regenerate:
        existing = get_latest_roadmap(db, user_id)
        if existing:
            return {"user_id": user_id, "roadmap": existing, "cached": True}

    roadmap = await generate_roadmap(db, user_id, user.skill_level, user.goal)
    db.commit()
    return {"user_id": user_id, "roadmap": roadmap, "cached": False}
