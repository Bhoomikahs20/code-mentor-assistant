"""
database.py – Synchronous SQLAlchemy engine for PostgreSQL
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:1234@localhost:5432/codementor_ai")

# Synchronous engine (psycopg2 driver)
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,   # Reconnect on stale connections
    pool_size=5,
    max_overflow=10,
    echo=False,           # Set True to log SQL statements
)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


class Base(DeclarativeBase):
    """Base class for all ORM models."""
    pass


def get_db():
    """FastAPI dependency: yields a sync DB session per request."""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def create_tables():
    """Create all DB tables (called at startup)."""
    from app.models import user, submission, error_pattern, roadmap  # noqa: F401
    Base.metadata.create_all(bind=engine)
