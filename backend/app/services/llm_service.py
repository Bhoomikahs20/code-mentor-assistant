"""
services/llm_service.py
-----------------------
Builds a structured prompt for the LLM and parses the JSON response.
Validates output and retries once on failure.
Returns a safe fallback if validation still fails.
"""
from __future__ import annotations
import json
import logging
from typing import Any

from openai import AsyncOpenAI

from app.config import get_settings
from app.utils.validators import validate_feedback_json

logger = logging.getLogger(__name__)
settings = get_settings()
client = AsyncOpenAI(api_key=settings.openai_api_key)

# ────────────────────────────────────────────────────────────
# System prompt – instructs the LLM to output strict JSON
# ────────────────────────────────────────────────────────────
SYSTEM_PROMPT = """You are CodeMentor AI, an expert code reviewer and teacher specializing in helping 
students prepare for technical placements at top companies.

Your task: analyze the provided code and knowledge context, then return ONLY valid JSON.
No markdown, no code blocks, no extra text – pure JSON.

Required output format:
{
  "errors": [
    {
      "line": <int>,
      "type": "<syntax_error|logic_error|runtime_error|naming_issue|performance>",
      "concept": "<e.g. recursion, loops, strings, arrays>",
      "what": "<brief description of what is wrong>",
      "why": "<explanation of why it is a problem>",
      "fix": "<clear instruction on how to fix it>",
      "fixed_code": "<corrected code snippet>"
    }
  ],
  "overall_feedback": "<2-3 sentence summary of the code quality>",
  "concepts_to_study": ["<concept1>", "<concept2>"],
  "confidence_score": <float 0.0–1.0>,
  "is_recurring": <true|false>,
  "encouraging_message": "<short motivating message for the student>"
}

Rules:
- confidence_score must be between 0.0 and 1.0
- errors must be an array (empty array if no errors)
- If code is perfect, return empty errors and confidence_score 1.0
"""


async def analyze_code(
    code: str,
    language: str,
    context: str,
    code_features: dict[str, Any],
    is_recurring: bool = False,
) -> dict:
    """
    Send code + RAG context to the LLM and return validated JSON feedback.
    Retries once on invalid JSON. Falls back to safe response if still invalid.
    """
    user_prompt = _build_user_prompt(code, language, context, code_features, is_recurring)

    for attempt in range(2):
        try:
            response = await client.chat.completions.create(
                model=settings.model_name,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.25,   # Low temperature for consistent, reliable JSON
                response_format={"type": "json_object"},
                max_tokens=1500,
            )
            raw = response.choices[0].message.content or "{}"
            feedback = json.loads(raw)

            # Validate structure
            is_valid, fixed = validate_feedback_json(feedback)
            if is_valid:
                return fixed

            logger.warning("LLM returned invalid feedback on attempt %d, retrying...", attempt + 1)

        except json.JSONDecodeError as e:
            logger.error("JSON decode error attempt %d: %s", attempt + 1, e)
        except Exception as e:
            logger.error("LLM call failed attempt %d: %s", attempt + 1, e)

    # Both attempts failed → return safe fallback
    logger.error("Both LLM attempts failed. Returning fallback feedback.")
    return _fallback_feedback(language)


def _build_user_prompt(
    code: str,
    language: str,
    context: str,
    features: dict,
    is_recurring: bool,
) -> str:
    """Compose the structured user message sent to the LLM."""
    suspected = ", ".join(features.get("suspected_concepts", ["general"]))
    has_recursion = features.get("has_recursion", False)
    has_loops = features.get("has_loops", False)
    complexity = features.get("complexity_estimate", "medium")

    recurring_note = (
        "\n⚠️  IMPORTANT: This student has made similar errors before. "
        "Set is_recurring=true and be firm but supportive in your feedback."
        if is_recurring else ""
    )

    return f"""Language: {language}
Suspected Concepts: {suspected}
Has Recursion: {has_recursion}
Has Loops: {has_loops}
Complexity: {complexity}
{recurring_note}

=== RELEVANT KNOWLEDGE CONTEXT ===
{context}

=== STUDENT'S CODE ===
```{language}
{code}
```

Analyze the code carefully using the provided context. Return ONLY the JSON object."""


def _fallback_feedback(language: str) -> dict:
    """Safe default response when LLM fails."""
    return {
        "errors": [
            {
                "line": 0,
                "type": "general",
                "concept": "general_programming",
                "what": "Unable to fully analyze this code at the moment.",
                "why": "The AI analysis service encountered an issue.",
                "fix": "Please review your code manually and try again.",
                "fixed_code": "",
            }
        ],
        "overall_feedback": (
            f"Your {language} code was received, but the AI had trouble completing a full analysis. "
            "This is a temporary issue. Please try again in a moment."
        ),
        "concepts_to_study": ["general_programming"],
        "confidence_score": 0.3,
        "is_recurring": False,
        "encouraging_message": "Keep coding! Every practice session makes you stronger. 💪",
    }
