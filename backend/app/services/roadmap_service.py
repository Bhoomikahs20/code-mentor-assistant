"""
services/roadmap_service.py
---------------------------
Generates a structured learning roadmap from the user's top error concepts
using the LLM. Stores the result in the DB (sync).
"""
from __future__ import annotations
from typing import Optional
import json
import logging
from datetime import datetime

from openai import AsyncOpenAI
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models.roadmap import Roadmap
from app.services.pattern_service import get_top_concepts

logger = logging.getLogger(__name__)
settings = get_settings()
client = AsyncOpenAI(api_key=settings.openai_api_key)

ROADMAP_SYSTEM_PROMPT = """You are an expert learning path designer for programming students.
Create a structured roadmap based on the student's weak areas.
Return ONLY valid JSON in exactly this format:
{
  "title": "Your Personalized Learning Roadmap",
  "total_weeks": <int>,
  "weeks": [
    {
      "week": <int>,
      "focus": "<main theme>",
      "topics": [
        {
          "name": "<topic name>",
          "why": "<why this helps the student>",
          "estimated_time": "<e.g. 4 hours>",
          "resources": ["<resource hint>"]
        }
      ],
      "practice_goal": "<what to submit this week>"
    }
  ]
}"""


async def generate_roadmap(
    db: Session,
    user_id: str,
    skill_level: str = "beginner",
    goal: str = "placement",
) -> dict:
    """Generate and persist a personalized roadmap for the user."""
    top_concepts = get_top_concepts(db, user_id, limit=3)

    if not top_concepts:
        return _default_roadmap(skill_level, goal)

    concept_names = [c["concept"] for c in top_concepts]
    user_msg = (
        f"Student profile:\n- Skill level: {skill_level}\n- Goal: {goal}\n"
        f"- Weakest concepts: {', '.join(concept_names)}\n\n"
        "Generate a 6-week roadmap addressing these weaknesses toward placement readiness."
    )

    try:
        response = await client.chat.completions.create(
            model=settings.model_name,
            messages=[
                {"role": "system", "content": ROADMAP_SYSTEM_PROMPT},
                {"role": "user", "content": user_msg},
            ],
            temperature=0.3,
            response_format={"type": "json_object"},
            max_tokens=1200,
        )
        roadmap_data = json.loads(response.choices[0].message.content or "{}")
    except Exception as e:
        logger.error("Roadmap LLM generation failed: %s", e)
        roadmap_data = _default_roadmap(skill_level, goal)

    # Version bump if one already exists
    existing = (
        db.query(Roadmap)
        .filter(Roadmap.user_id == user_id)
        .order_by(Roadmap.version.desc())
        .first()
    )
    version = (existing.version + 1) if existing else 1
    db.add(Roadmap(user_id=user_id, roadmap_data=roadmap_data, version=version, generated_at=datetime.utcnow()))
    db.flush()
    return roadmap_data


def get_latest_roadmap(db: Session, user_id: str) -> Optional[dict]:
    """Fetch the most recent roadmap for a user from DB."""
    roadmap = (
        db.query(Roadmap)
        .filter(Roadmap.user_id == user_id)
        .order_by(Roadmap.version.desc())
        .first()
    )
    return roadmap.roadmap_data if roadmap else None


def _default_roadmap(skill_level: str, goal: str) -> dict:
    """Static fallback roadmap for new users or LLM failures."""
    return {
        "title": "Your Personalized Learning Roadmap",
        "total_weeks": 6,
        "weeks": [
            {"week": 1, "focus": "Python Fundamentals", "topics": [
                {"name": "Variables & Data Types", "why": "Foundation of all programs", "estimated_time": "3 hours", "resources": ["Python docs"]},
                {"name": "Control Flow", "why": "Loops and conditions are tested in every interview", "estimated_time": "4 hours", "resources": ["LeetCode easy"]},
            ], "practice_goal": "Submit 3 loop-based solutions"},
            {"week": 2, "focus": "Functions & Recursion", "topics": [
                {"name": "Functions & Scope", "why": "Clean code starts with good functions", "estimated_time": "3 hours", "resources": ["Exercism Python"]},
                {"name": "Recursion Fundamentals", "why": "Recursion questions are common in placements", "estimated_time": "5 hours", "resources": ["Visualize recursion tree"]},
            ], "practice_goal": "Solve 5 recursion problems"},
            {"week": 3, "focus": "Data Structures", "topics": [
                {"name": "Arrays & Lists", "why": "Most fundamental DS", "estimated_time": "4 hours", "resources": ["LeetCode array tag"]},
                {"name": "Stacks & Queues", "why": "Used in BFS/DFS and system design", "estimated_time": "4 hours", "resources": ["GeeksforGeeks"]},
            ], "practice_goal": "Submit 5 DS problems"},
            {"week": 4, "focus": "Algorithms", "topics": [
                {"name": "Sorting Algorithms", "why": "Core CS knowledge tested in interviews", "estimated_time": "4 hours", "resources": ["VisuAlgo"]},
                {"name": "Binary Search", "why": "Pattern used in many medium problems", "estimated_time": "3 hours", "resources": ["LeetCode binary search"]},
            ], "practice_goal": "Solve 8 algorithm problems"},
            {"week": 5, "focus": "Dynamic Programming", "topics": [
                {"name": "Memoization", "why": "Converts exponential to polynomial time", "estimated_time": "5 hours", "resources": ["NeetCode DP playlist"]},
            ], "practice_goal": "Solve 5 DP problems"},
            {"week": 6, "focus": "Mock Interviews", "topics": [
                {"name": "Timed Problem Solving", "why": "Simulate real interview pressure", "estimated_time": "6 hours", "resources": ["Pramp", "Interviewing.io"]},
            ], "practice_goal": "Complete 3 mock interviews"},
        ],
    }
