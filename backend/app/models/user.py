"""models/user.py – User ORM model (SQLAlchemy 2.x, Python 3.8 compatible)"""
import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, DateTime, Integer, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    college: Mapped[str] = mapped_column(String(200), default="")
    hashed_password: Mapped[str] = mapped_column(String(256), default="")
    streak: Mapped[int] = mapped_column(Integer, default=0)
    placement_readiness: Mapped[float] = mapped_column(Float, default=0.0)
    skill_level: Mapped[str] = mapped_column(String(20), default="beginner")
    goal: Mapped[str] = mapped_column(String(100), default="placement")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships – use string names to avoid circular imports
    submissions: Mapped[List["Submission"]] = relationship(back_populates="user", lazy="select")
    error_patterns: Mapped[List["ErrorPattern"]] = relationship(back_populates="user", lazy="select")
    roadmaps: Mapped[List["Roadmap"]] = relationship(back_populates="user", lazy="select")
