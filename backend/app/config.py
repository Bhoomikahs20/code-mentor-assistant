"""
config.py – App settings loaded from .env
"""
from __future__ import annotations
from typing import List
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    openai_api_key: str = ""
    database_url: str = "sqlite+aiosqlite:///./codementor.db"
    model_name: str = "gpt-4o-mini"
    embedding_model: str = "text-embedding-3-small"
    faiss_index_path: str = "./knowledge_base/faiss_index"
    secret_key: str = "changeme-use-a-real-secret-32chars"

    # CORS origins for React frontend
    cors_origins: List[str] = [
        "http://localhost:5173",  # Vite dev
        "http://localhost:3000",  # CRA dev
    ]

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
