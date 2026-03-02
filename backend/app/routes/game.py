"""routes/game.py – Generate and serve game questions (sync)"""
from __future__ import annotations
import random
import logging
from typing import Optional

from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.game_service import generate_question, GAME_TYPES

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/game", tags=["game"])


@router.get("/question/{game_type}")
async def get_game_question(
    game_type: str,
    user_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """Generate a game question targeting the user's weakest concept."""
    if game_type not in GAME_TYPES and game_type != "random":
        raise HTTPException(
            status_code=400,
            detail=f"Invalid game type. Must be one of: {', '.join(GAME_TYPES)}, random",
        )
    if game_type == "random":
        game_type = random.choice(GAME_TYPES)

    question = await generate_question(db, game_type=game_type, user_id=user_id)
    return {"game_type": game_type, "question": question}


@router.get("/types")
def list_game_types():
    """List all available game types."""
    return {
        "game_types": [
            {"id": "debug_the_bug",   "title": "Debug the Bug",    "icon": "🐛"},
            {"id": "predict_output",  "title": "Predict Output",   "icon": "🎯"},
            {"id": "code_jumble",     "title": "Code Jumble",      "icon": "🧩"},
            {"id": "syntax_sprint",   "title": "Syntax Sprint",    "icon": "⚡"},
            {"id": "trivia",          "title": "Code Trivia",      "icon": "🎓"},
        ]
    }
