"""models/submission.py – Code submission + async job state (Python 3.8 compatible)"""
import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, DateTime, Text, JSON, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Submission(Base):
    __tablename__ = "submissions"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), index=True)
    language: Mapped[str] = mapped_column(String(30), default="python")
    code: Mapped[str] = mapped_column(Text)
    problem_description: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(20), default="processing")
    feedback: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    confidence_score: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    user: Mapped["User"] = relationship(back_populates="submissions")
