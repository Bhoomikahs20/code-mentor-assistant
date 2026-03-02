"""models/error_pattern.py – Per-user error concept frequency tracking (Python 3.8 compatible)"""
import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Integer, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class ErrorPattern(Base):
    __tablename__ = "error_patterns"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), index=True)
    concept: Mapped[str] = mapped_column(String(100), index=True)
    error_type: Mapped[str] = mapped_column(String(50), default="logic_error")
    frequency: Mapped[int] = mapped_column(Integer, default=1)
    is_recurring: Mapped[bool] = mapped_column(Boolean, default=False)
    last_seen: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    first_seen: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship(back_populates="error_patterns")
