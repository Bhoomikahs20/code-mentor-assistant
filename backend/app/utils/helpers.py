"""
utils/helpers.py
----------------
General utility functions used across the app.
"""
from __future__ import annotations
import hashlib
import uuid
from datetime import datetime, timedelta


def generate_job_id() -> str:
    """Generate a unique job ID (UUID4)."""
    return str(uuid.uuid4())


def hash_password(password: str) -> str:
    """Simple SHA-256 password hash (for demo; use bcrypt in production)."""
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(plain: str, hashed: str) -> bool:
    return hash_password(plain) == hashed


def calculate_improvement(submissions: list) -> int:
    """
    Calculate improvement percentage from a list of submission scores.
    Compares first 3 vs last 3 submissions.
    """
    if len(submissions) < 2:
        return 0
    scores = [s.confidence_score for s in submissions if s.confidence_score]
    if len(scores) < 2:
        return 0
    early = sum(scores[:3]) / min(3, len(scores))
    recent = sum(scores[-3:]) / min(3, len(scores))
    if early == 0:
        return 0
    return int(((recent - early) / early) * 100)


def calculate_streak(submissions: list) -> int:
    """
    Calculate current coding streak from submission dates.
    Counts consecutive days back from today.
    """
    if not submissions:
        return 0
    dates = sorted(
        {s.created_at.date() for s in submissions},
        reverse=True,
    )
    streak = 0
    today = datetime.utcnow().date()
    for i, d in enumerate(dates):
        expected = today - timedelta(days=i)
        if d == expected:
            streak += 1
        else:
            break
    return streak


def build_rag_query(code: str, features: dict, problem_desc: str = "") -> str:
    """
    Build a concise RAG query from code features.
    Keeps query focused so embeddings stay relevant.
    """
    concepts = " ".join(features.get("suspected_concepts", ["programming"]))
    loops = ", ".join(features.get("loop_types", []))
    parts = [
        f"programming concepts: {concepts}",
        f"language: {features.get('language', 'python')}",
    ]
    if loops:
        parts.append(f"loop types: {loops}")
    if features.get("has_recursion"):
        parts.append("recursive function")
    if features.get("syntax_error"):
        parts.append("syntax error")
    if problem_desc:
        parts.append(f"problem: {problem_desc[:200]}")
    return ". ".join(parts)
