"""schemas/submission_schema.py – Pydantic schemas for code submission"""
from __future__ import annotations
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class CodeSubmitRequest(BaseModel):
    user_id: str
    code: str
    language: str = "python"
    problem_description: Optional[str] = ""


class JobStatusResponse(BaseModel):
    job_id: str
    status: str          # processing | completed | failed
    feedback: Optional[dict] = None
    created_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
