"""
services/preprocessing.py
--------------------------
Parse submitted code using Python's AST module (for Python)
or a simple regex-based parser for other languages.
Returns structured features used by the RAG query builder.
"""
from __future__ import annotations
import ast
import re
from typing import Any


def extract_features(code: str, language: str) -> dict[str, Any]:
    """
    Extract structural features from submitted code.
    Returns a dict used to build a targeted RAG query.
    """
    if language.lower() == "python":
        return _parse_python(code)
    else:
        return _parse_generic(code, language)


# ────────────────────────────────────────────────────────────
# Python AST parser
# ────────────────────────────────────────────────────────────

def _parse_python(code: str) -> dict[str, Any]:
    features: dict[str, Any] = {
        "language": "python",
        "functions": [],
        "has_recursion": False,
        "has_loops": False,
        "loop_types": [],
        "has_try_except": False,
        "has_class": False,
        "import_count": 0,
        "line_count": len(code.strip().splitlines()),
        "complexity_estimate": "low",
        "suspected_concepts": [],
    }

    try:
        tree = ast.parse(code)
    except SyntaxError as e:
        # Even a syntax error is useful info – record it
        features["syntax_error"] = str(e)
        features["suspected_concepts"].append("syntax_error")
        return features

    fn_names: list[str] = []

    for node in ast.walk(tree):
        # ── Functions ──
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            fn_names.append(node.name)
            features["functions"].append(node.name)

        # ── Loops ──
        elif isinstance(node, ast.For):
            features["has_loops"] = True
            if "for" not in features["loop_types"]:
                features["loop_types"].append("for")

        elif isinstance(node, ast.While):
            features["has_loops"] = True
            if "while" not in features["loop_types"]:
                features["loop_types"].append("while")

        # ── Try/Except ──
        elif isinstance(node, ast.Try):
            features["has_try_except"] = True

        # ── Classes ──
        elif isinstance(node, ast.ClassDef):
            features["has_class"] = True

        # ── Imports ──
        elif isinstance(node, (ast.Import, ast.ImportFrom)):
            features["import_count"] += 1

        # ── Recursion: function calls its own name ──
        elif isinstance(node, ast.Call):
            func = node.func
            if isinstance(func, ast.Name) and func.id in fn_names:
                features["has_recursion"] = True

    # ── Complexity estimate ──
    depth = _nesting_depth(tree)
    if depth >= 4 or len(features["functions"]) >= 5:
        features["complexity_estimate"] = "high"
    elif depth >= 2 or len(features["functions"]) >= 2:
        features["complexity_estimate"] = "medium"

    # ── Infer likely concepts ──
    features["suspected_concepts"] = _infer_concepts(features)

    return features


def _nesting_depth(tree: ast.AST, depth: int = 0) -> int:
    """Recursively calculate max nesting depth."""
    max_depth = depth
    for child in ast.iter_child_nodes(tree):
        if isinstance(child, (ast.For, ast.While, ast.If,
                               ast.FunctionDef, ast.AsyncFunctionDef,
                               ast.Try, ast.With)):
            max_depth = max(max_depth, _nesting_depth(child, depth + 1))
        else:
            max_depth = max(max_depth, _nesting_depth(child, depth))
    return max_depth


def _infer_concepts(f: dict) -> list[str]:
    """Map feature flags to teaching concepts for RAG query."""
    concepts: list[str] = []
    if f.get("has_recursion"):
        concepts.append("recursion")
    if f.get("has_loops"):
        concepts.extend(f.get("loop_types", []))
    if f.get("syntax_error"):
        concepts.append("syntax_error")
    if f.get("has_class"):
        concepts.append("object_oriented_programming")
    if f.get("complexity_estimate") == "high":
        concepts.append("code_complexity")
    return list(set(concepts)) or ["general_python"]


# ────────────────────────────────────────────────────────────
# Generic regex parser for other languages
# ────────────────────────────────────────────────────────────

def _parse_generic(code: str, language: str) -> dict[str, Any]:
    features: dict[str, Any] = {
        "language": language,
        "has_loops": bool(re.search(r'\b(for|while)\b', code)),
        "has_recursion": False,  # heuristic not available without AST
        "line_count": len(code.strip().splitlines()),
        "complexity_estimate": "medium",
        "suspected_concepts": ["general_programming"],
        "functions": re.findall(r'\bfunction\s+(\w+)', code)
                    or re.findall(r'\bdef\s+(\w+)', code)
                    or re.findall(r'\b(\w+)\s*\(', code)[:5],
    }
    return features
