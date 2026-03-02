"""schemas/feedback_schema.py – Structured LLM feedback Pydantic models"""
from __future__ import annotations
from pydantic import BaseModel, Field
from typing import Optional


class ErrorDetail(BaseModel):
    line: int = 0
    type: str                    # logic_error | syntax_error | runtime_error | naming | performance
    concept: str                 # recursion | loops | strings | arrays | etc.
    what: str                    # What is wrong
    why: str                     # Why it is wrong
    fix: str                     # How to fix it
    fixed_code: str = ""         # Fixed code snippet


class StructuredFeedback(BaseModel):
    errors: list[ErrorDetail] = Field(default_factory=list)
    overall_feedback: str = ""
    concepts_to_study: list[str] = Field(default_factory=list)
    confidence_score: float = Field(ge=0.0, le=1.0, default=0.5)
    is_recurring: bool = False
    encouraging_message: str = ""
    code_features: Optional[dict] = None    # AST-extracted features injected by preprocessing


class FeedbackResponse(BaseModel):
    job_id: str
    status: str
    feedback: Optional[StructuredFeedback] = None
    language: str = "python"
