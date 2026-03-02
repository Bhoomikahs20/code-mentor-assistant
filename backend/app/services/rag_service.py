"""
services/rag_service.py
-----------------------
Retrieval-Augmented Generation pipeline using FAISS + OpenAI embeddings.
Falls back gracefully if FAISS index not yet built.
"""
from __future__ import annotations
import os
import json
import logging
from pathlib import Path
from typing import Optional

import numpy as np
from openai import AsyncOpenAI

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()
client = AsyncOpenAI(api_key=settings.openai_api_key)

# In-memory FAISS index + metadata (loaded once at startup)
_faiss_index = None
_metadata: list[dict] = []


def load_faiss_index() -> bool:
    """
    Load FAISS index from disk into memory.
    Called at app startup via lifespan event.
    Returns True if loaded, False if not found (demo mode).
    """
    global _faiss_index, _metadata

    index_path = Path(settings.faiss_index_path)
    meta_path = index_path.parent / "metadata.json"

    if not index_path.exists():
        logger.warning(
            "FAISS index not found at %s. "
            "Run knowledge_base/build_kb.py to create it. "
            "Falling back to static context.",
            index_path,
        )
        _metadata = _get_static_fallback_chunks()
        return False

    try:
        import faiss  # import here so startup doesn't crash if faiss missing
        _faiss_index = faiss.read_index(str(index_path))
        if meta_path.exists():
            with open(meta_path) as f:
                _metadata = json.load(f)
        logger.info("FAISS index loaded: %d vectors", _faiss_index.ntotal)
        return True
    except Exception as e:
        logger.error("Failed to load FAISS index: %s", e)
        _metadata = _get_static_fallback_chunks()
        return False


async def retrieve_context(
    query: str,
    language: str = "python",
    top_k: int = 4,
) -> str:
    """
    1. Embed the query with OpenAI embeddings.
    2. Search FAISS for top-k nearest chunks.
    3. Filter by language if metadata exists.
    4. Return concatenated context string.
    Falls back to static text if FAISS not available.
    """
    if _faiss_index is None:
        return _get_fallback_context(language)

    try:
        vector = await _embed(query)
        distances, indices = _faiss_index.search(
            np.array([vector], dtype=np.float32), top_k * 2
        )

        chunks: list[str] = []
        for idx in indices[0]:
            if idx < 0 or idx >= len(_metadata):
                continue
            chunk = _metadata[idx]
            # Language filter: include if language matches OR chunk is generic
            chunk_lang = chunk.get("language", "general")
            if chunk_lang in ("general", language.lower()):
                chunks.append(chunk.get("text", ""))
            if len(chunks) >= top_k:
                break

        if not chunks:
            return _get_fallback_context(language)

        return "\n\n---\n\n".join(chunks)

    except Exception as e:
        logger.error("RAG retrieval failed: %s", e)
        return _get_fallback_context(language)


async def _embed(text: str) -> list[float]:
    """Get OpenAI embedding vector for a piece of text."""
    response = await client.embeddings.create(
        model=settings.embedding_model,
        input=text[:8000],  # stay within token limits
    )
    return response.data[0].embedding


# ────────────────────────────────────────────────────────────
# Static fallback context (used before KB is built or on error)
# ────────────────────────────────────────────────────────────

def _get_fallback_context(language: str) -> str:
    chunks = _get_static_fallback_chunks()
    relevant = [c["text"] for c in chunks if c.get("language") in ("general", language.lower())]
    return "\n\n---\n\n".join(relevant[:4]) or "No context available."


def _get_static_fallback_chunks() -> list[dict]:
    """Hardcoded mini knowledge base used when FAISS index is absent."""
    return [
        {
            "language": "python",
            "text": (
                "PYTHON RECURSION BEST PRACTICES:\n"
                "• Always define a base case first to prevent infinite recursion.\n"
                "• Ensure every recursive call moves toward the base case.\n"
                "• Use sys.setrecursionlimit() carefully; prefer iteration when depth may be large.\n"
                "• Common mistake: missing return statement in recursive branch.\n"
                "Example fix:\n"
                "def factorial(n):\n"
                "    if n <= 1: return 1   # base case\n"
                "    return n * factorial(n - 1)  # moves toward base\n"
            ),
        },
        {
            "language": "python",
            "text": (
                "PYTHON LOOP LOGIC ERRORS:\n"
                "• Off-by-one: use range(len(arr)) not range(len(arr)+1).\n"
                "• Mutating a list while iterating over it causes skipped elements.\n"
                "• Prefer enumerate() over manual index tracking.\n"
                "• Infinite while loops: always ensure the condition eventually becomes False.\n"
                "Example:\n"
                "for i, item in enumerate(my_list):  # preferred\n"
                "    print(i, item)\n"
            ),
        },
        {
            "language": "general",
            "text": (
                "CLEAN CODE GUIDELINES:\n"
                "• Use descriptive variable names: `user_count` not `uc`.\n"
                "• Single responsibility: each function should do one thing.\n"
                "• DRY principle: Don't Repeat Yourself – extract common logic.\n"
                "• Limit function size to ~20 lines for readability.\n"
                "• Add docstrings to all public functions and classes.\n"
            ),
        },
        {
            "language": "python",
            "text": (
                "COMMON BEGINNER PYTHON ERRORS:\n"
                "• IndentationError: Python uses indentation for blocks, not braces.\n"
                "• NameError: referencing a variable before assignment.\n"
                "• TypeError: passing wrong type to a function (e.g., str + int).\n"
                "• IndexError: accessing list index out of range.\n"
                "• Mutable default argument: def f(lst=[]) – use None and create inside.\n"
            ),
        },
        {
            "language": "general",
            "text": (
                "ALGORITHMIC COMPLEXITY:\n"
                "• O(n²) nested loops are often optimizable with hashmaps to O(n).\n"
                "• Two-pointer technique eliminates one nested loop in sorted arrays.\n"
                "• sliding window: avoid redundant recomputation in subarray problems.\n"
                "• Binary search: use when the array is sorted and you need O(log n).\n"
            ),
        },
    ]
