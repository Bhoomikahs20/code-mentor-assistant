"""
app/main.py – FastAPI application entry point (synchronous PostgreSQL)
"""
from __future__ import annotations
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.database import engine, Base, create_tables
from app.routes import auth, code, feedback, roadmap, analytics, game
from app.services.rag_service import load_faiss_index

# ─────────────────────────────────────────────────────────────
# Logging
# ─────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)
settings = get_settings()


# ─────────────────────────────────────────────────────────────
# Create all DB tables on startup (sync, one-time)
# ─────────────────────────────────────────────────────────────
from app.models import user, submission, error_pattern, roadmap as roadmap_model  # noqa: F401, E402
Base.metadata.create_all(bind=engine)
logger.info("✅ Database tables ready (PostgreSQL).")


# ─────────────────────────────────────────────────────────────
# Load FAISS index into memory (graceful fallback if not built)
# ─────────────────────────────────────────────────────────────
_faiss_loaded = load_faiss_index()
if not _faiss_loaded:
    logger.warning(
        "⚠️  FAISS index not found. Using static fallback context. "
        "Run: cd backend && python knowledge_base/build_kb.py"
    )


# ─────────────────────────────────────────────────────────────
# FastAPI App
# ─────────────────────────────────────────────────────────────
app = FastAPI(
    title="CodeMentor AI API",
    description=(
        "AI-powered code review backend with RAG pipeline, "
        "Error DNA tracking, personalized roadmap generation, and coding games."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)


# ─────────────────────────────────────────────────────────────
# CORS – allow React Vite frontend
# ─────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────────────────────
# Routers
# ─────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(code.router)
app.include_router(feedback.router)
app.include_router(roadmap.router)
app.include_router(analytics.router)
app.include_router(game.router)


# ─────────────────────────────────────────────────────────────
# Root + Health Check
# ─────────────────────────────────────────────────────────────
@app.get("/", tags=["health"])
def root():
    return {
        "service": "CodeMentor AI API",
        "version": "1.0.0",
        "status": "running",
        "database": "postgresql",
        "docs": "/docs",
    }


@app.get("/health", tags=["health"])
def health():
    try:
        with engine.connect() as conn:
            conn.execute(__import__("sqlalchemy").text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": str(e)}


# ─────────────────────────────────────────────────────────────
# Global Exception Handler
# ─────────────────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error("Unhandled exception: %s", exc, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)},
    )


# ─────────────────────────────────────────────────────────────
# Entry point
# ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
