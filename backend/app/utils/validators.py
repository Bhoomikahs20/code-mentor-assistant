"""
utils/validators.py
--------------------
Validates the LLM output JSON structure and repairs common issues.
"""
from __future__ import annotations
from typing import Any


def validate_feedback_json(data: dict[str, Any]) -> tuple[bool, dict]:
    """
    Validate the feedback dict returned by the LLM.
    Returns (is_valid, fixed_data).
    Attempts to repair minor issues rather than failing outright.
    """
    if not isinstance(data, dict):
        return False, {}

    fixed = data.copy()

    # ── errors: must be a list ──
    if "errors" not in fixed or not isinstance(fixed["errors"], list):
        fixed["errors"] = []

    # ── validate each error item ──
    valid_errors = []
    for err in fixed["errors"]:
        if not isinstance(err, dict):
            continue
        err.setdefault("line", 0)
        err.setdefault("type", "logic_error")
        err.setdefault("concept", "general")
        err.setdefault("what", "Issue detected")
        err.setdefault("why", "")
        err.setdefault("fix", "Please review this part of your code.")
        err.setdefault("fixed_code", "")
        valid_errors.append(err)
    fixed["errors"] = valid_errors

    # ── overall_feedback: must be a non-empty string ──
    if not isinstance(fixed.get("overall_feedback"), str) or not fixed["overall_feedback"]:
        fixed["overall_feedback"] = "Code reviewed. See individual error details above."

    # ── concepts_to_study: must be a list of strings ──
    if not isinstance(fixed.get("concepts_to_study"), list):
        fixed["concepts_to_study"] = [
            err.get("concept", "general") for err in valid_errors[:3]
        ] or ["general_programming"]
    fixed["concepts_to_study"] = [
        str(c) for c in fixed["concepts_to_study"] if c
    ][:5]

    # ── confidence_score: float between 0.0 and 1.0 ──
    score = fixed.get("confidence_score", 0.5)
    try:
        score = float(score)
        score = max(0.0, min(1.0, score))
    except (TypeError, ValueError):
        score = 0.5
    fixed["confidence_score"] = score

    # ── is_recurring: must be bool ──
    fixed["is_recurring"] = bool(fixed.get("is_recurring", False))

    # ── encouraging_message: must be string ──
    if not isinstance(fixed.get("encouraging_message"), str):
        fixed["encouraging_message"] = "Keep coding! You're improving every day. 🚀"

    return True, fixed
