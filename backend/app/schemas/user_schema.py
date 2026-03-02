"""schemas/user_schema.py – Pydantic schemas for User endpoints"""
from __future__ import annotations
from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    college: str = ""
    password: str
    skill_level: str = "beginner"
    goal: str = "placement"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    college: str
    streak: int
    placement_readiness: float
    skill_level: str
    goal: str
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
