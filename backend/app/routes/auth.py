"""routes/auth.py – User registration and login (sync PostgreSQL)"""
from __future__ import annotations
import logging

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user_schema import UserCreate, UserLogin, UserResponse, TokenResponse
from app.utils.helpers import hash_password, verify_password, generate_job_id

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered.")

    user = User(
        id=generate_job_id(),
        name=payload.name,
        email=payload.email,
        college=payload.college,
        hashed_password=hash_password(payload.password),
        skill_level=payload.skill_level,
        goal=payload.goal,
    )
    db.add(user)
    db.flush()

    token = f"demo-token-{user.id}"
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    """Login with email + password."""
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = f"demo-token-{user.id}"
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.get("/me/{user_id}", response_model=UserResponse)
def get_me(user_id: str, db: Session = Depends(get_db)):
    """Get user profile by ID."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return UserResponse.model_validate(user)
