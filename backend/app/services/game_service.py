"""
services/game_service.py
------------------------
Generates coding game questions targeted at the user's weakest concept (sync).
"""
from __future__ import annotations
import json
import logging
import random
from typing import Optional, List

from openai import AsyncOpenAI
from sqlalchemy.orm import Session

from app.config import get_settings
from app.services.pattern_service import get_top_concepts

logger = logging.getLogger(__name__)
settings = get_settings()
client = AsyncOpenAI(api_key=settings.openai_api_key)

GAME_TYPES = ["debug_the_bug", "predict_output", "code_jumble", "syntax_sprint", "trivia"]

GAME_SYSTEM_PROMPT = """You are a coding game designer for programming students.
Generate a fun, educational game question in ONLY valid JSON.
No markdown, no extra text, just the JSON object.
Required format:
{
  "game_type": "<type>",
  "concept": "<concept>",
  "difficulty": "<easy|medium|hard>",
  "question": "<game prompt>",
  "code_snippet": "<code snippet>",
  "options": ["<A>", "<B>", "<C>", "<D>"],
  "correct_answer": "<correct option>",
  "explanation": "<why this is the answer>",
  "hint": "<optional hint>",
  "points": <int>
}"""

STATIC_QUESTIONS: dict = {
    "debug_the_bug": {
        "game_type": "debug_the_bug", "concept": "loops", "difficulty": "easy",
        "question": "Find and fix the bug in this Python function:",
        "code_snippet": "def sum_list(nums):\n    total = 0\n    for i in range(len(nums) + 1):  # Bug!\n        total += nums[i]\n    return total",
        "options": ["A) range(len(nums)+1) → range(len(nums))", "B) total = 0 → total = 1", "C) return total → return total-1", "D) No bug"],
        "correct_answer": "A", "explanation": "range(len(nums)+1) causes IndexError. Use range(len(nums)).", "hint": "Check the loop boundary.", "points": 100,
    },
    "predict_output": {
        "game_type": "predict_output", "concept": "recursion", "difficulty": "medium",
        "question": "What does fib(4) return?",
        "code_snippet": "def fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2)",
        "options": ["A) 2", "B) 3", "C) 4", "D) 5"],
        "correct_answer": "B", "explanation": "fib(4)=fib(3)+fib(2)=2+1=3", "hint": "Trace the recursion tree.", "points": 150,
    },
    "syntax_sprint": {
        "game_type": "syntax_sprint", "concept": "syntax_error", "difficulty": "easy",
        "question": "Which line has a syntax error?",
        "code_snippet": "x = 10\nif x > 5\n    print('big')\nelse:\n    print('small')",
        "options": ["A) Line 1", "B) Line 2", "C) Line 3", "D) Line 4"],
        "correct_answer": "B", "explanation": "Line 2 is missing the colon: 'if x > 5:'", "hint": "Python conditions end with a colon.", "points": 80,
    },
    "trivia": {
        "game_type": "trivia", "concept": "algorithms", "difficulty": "easy",
        "question": "What is the time complexity of binary search?",
        "code_snippet": "",
        "options": ["A) O(n)", "B) O(n²)", "C) O(log n)", "D) O(1)"],
        "correct_answer": "C", "explanation": "Binary search halves the search space giving O(log n).", "hint": "Think about halving.", "points": 100,
    },
    "code_jumble": {
        "game_type": "code_jumble", "concept": "loops", "difficulty": "easy",
        "question": "Rearrange these lines to reverse a list:",
        "code_snippet": "return result\nresult = []\nfor item in reversed(lst):\n    result.append(item)\ndef reverse_list(lst):",
        "options": [],
        "correct_answer": "def reverse_list(lst):\n    result=[]\n    for item in reversed(lst):\n        result.append(item)\n    return result",
        "explanation": "Function definition → init → loop → return.", "hint": "Define function first.", "points": 120,
    },
}


async def generate_question(db: Session, game_type: str, user_id: Optional[str] = None) -> dict:
    """Generate a game question, targeting user's weakest concept if user_id given."""
    target_concept = "general_programming"
    if user_id:
        top = get_top_concepts(db, user_id, limit=1)
        if top:
            target_concept = top[0]["concept"]

    try:
        response = await client.chat.completions.create(
            model=settings.model_name,
            messages=[
                {"role": "system", "content": GAME_SYSTEM_PROMPT},
                {"role": "user", "content": f"Create a '{game_type}' question targeting: '{target_concept}'. Use Python. Medium difficulty."},
            ],
            temperature=0.6,
            response_format={"type": "json_object"},
            max_tokens=600,
        )
        question = json.loads(response.choices[0].message.content or "{}")
        question.setdefault("game_type", game_type)
        question.setdefault("concept", target_concept)
        question.setdefault("points", 100)
        return question
    except Exception as e:
        logger.error("Game question generation failed: %s", e)
        return STATIC_QUESTIONS.get(game_type, STATIC_QUESTIONS["trivia"])
