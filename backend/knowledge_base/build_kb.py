"""
knowledge_base/build_kb.py
---------------------------
Build the FAISS index from a curated set of coding knowledge chunks.
Run once: python knowledge_base/build_kb.py
The resulting index is saved to ./faiss_index for the RAG service.
"""
from __future__ import annotations
import json
import os
import sys
import asyncio
import logging
from pathlib import Path

# Add parent directory to path so we can import app modules
sys.path.insert(0, str(Path(__file__).parent.parent))

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────────────────────────────────────
# KNOWLEDGE BASE CHUNKS (~60 entries for a hackathon demo)
# Each chunk: {language, concept, text}
# ─────────────────────────────────────────────────────────────────────────────
CHUNKS = [
    # ── Python Fundamentals ──────────────────────────────────────────────────
    {"language": "python", "concept": "syntax_error", "text": "Python uses indentation instead of braces. Every block (if, for, while, def, class) must be consistently indented. A mismatch causes IndentationError. Use 4 spaces, not tabs. if condition:\n    do_something()  # Must be indented"},
    {"language": "python", "concept": "syntax_error", "text": "Colon (:) is required at the end of if/else/for/while/def/class statements. Missing colon is the most common Python syntax error. Correct: if x > 5:"},
    {"language": "python", "concept": "variables", "text": "Python variables are dynamically typed. Never declare type explicitly. x = 10 is fine. Common beginner mistake: using = for comparison (should be ==). Assignment: x = 5. Comparison: if x == 5."},
    {"language": "python", "concept": "strings", "text": "Common string errors: (1) using + to concatenate mixed types: str(x) + ' items'. (2) Off-by-one in slicing: s[0:5] gives 5 chars. (3) Strings are immutable – you cannot do s[0] = 'A'. Use s.replace() or rebuild."},
    {"language": "python", "concept": "type_error", "text": "TypeError occurs when you apply an operation to wrong type. Common: int + str (use str(n) to convert), calling non-callable, indexing non-sequence. Always validate input types before operations."},

    # ── Recursion ────────────────────────────────────────────────────────────
    {"language": "python", "concept": "recursion", "text": "RECURSION FUNDAMENTALS: Every recursive function needs (1) a base case that stops recursion, (2) a recursive case that calls itself with a smaller input. Missing base case → infinite recursion → RecursionError.\ndef factorial(n):\n    if n <= 1: return 1  # base case\n    return n * factorial(n-1)  # recursive case moves toward base"},
    {"language": "python", "concept": "recursion", "text": "RECURSION COMMON MISTAKES: (1) Forgetting return in recursive branch. (2) Base case condition wrong (e.g., n == 0 instead of n <= 1). (3) Not reducing problem size on each call. (4) Stack overflow from too-deep recursion (use iterative solution or memoization for large n)."},
    {"language": "python", "concept": "recursion", "text": "MEMOIZATION: Cache recursive call results to avoid recomputation. Use @functools.lru_cache or a dict. Transforms exponential O(2^n) time to O(n). from functools import lru_cache\n@lru_cache(maxsize=None)\ndef fib(n): return n if n < 2 else fib(n-1)+fib(n-2)"},
    {"language": "general", "concept": "recursion", "text": "Recursion vs Iteration: Recursion is elegant but has function call overhead and stack risk. Prefer iteration for simple loops. Use recursion for tree/graph traversal, divide-and-conquer, backtracking. Always analyze if tail-call or memoization is needed."},

    # ── Loops ────────────────────────────────────────────────────────────────
    {"language": "python", "concept": "loops", "text": "OFF-BY-ONE ERRORS: range(n) goes 0 to n-1 (n elements). range(1, n+1) goes 1 to n. Accessing arr[len(arr)] causes IndexError. Use range(len(arr)) for index-based iteration. Better: for item in arr (no index needed)."},
    {"language": "python", "concept": "loops", "text": "LOOP BEST PRACTICES: (1) Prefer enumerate() over manual index: for i, v in enumerate(lst). (2) Prefer zip() to iterate two lists: for a, b in zip(list1, list2). (3) Never modify a list while iterating it – use list comprehension or copy. (4) Use break and continue mindfully."},
    {"language": "python", "concept": "loops", "text": "INFINITE LOOPS: while loops must have a termination condition. Always ensure the loop variable is updated inside the body. While True patterns need a break statement. Common bug: condition never becomes False because variable isn't modified inside loop."},
    {"language": "python", "concept": "loops", "text": "NESTED LOOPS OPTIMIZATION: Two nested loops = O(n²). Consider: (1) HashMap/dict: replace inner loop with O(1) lookup. (2) Sorting + two pointers. (3) Sliding window. Example (Two Sum): instead of O(n²) nested loops, use a dict for O(n)."},

    # ── Data Structures ──────────────────────────────────────────────────────
    {"language": "python", "concept": "arrays", "text": "LIST OPERATIONS: append O(1), insert O(n), pop() O(1), pop(i) O(n), in-operator O(n), index O(n). Use deque for O(1) popleft. List comprehension is faster than for-loop append. sorted() returns new list; list.sort() sorts in-place."},
    {"language": "python", "concept": "arrays", "text": "COMMON LIST BUGS: (1) Shallow copy bug: b = a makes both point to same list, use b = a.copy(). (2) Empty list check: use 'if lst:' not 'if len(lst) > 0'. (3) Negative index: lst[-1] = last element (valid). (4) Slicing creates a copy; assignment to slice modifies in-place."},
    {"language": "python", "concept": "dictionaries", "text": "DICT BEST PRACTICES: Use .get(key, default) to avoid KeyError. Use dict comprehension. collections.defaultdict avoids key initialization. Counter for frequency counting. Check 'if key in d' before accessing. OrderedDict for ordered iteration (Python 3.7+ dicts are ordered by default)."},
    {"language": "general", "concept": "stacks", "text": "STACK (LIFO): Last-In-First-Out. Operations: push (append), pop (pop), peek ([-1]). Use cases: balanced parentheses, function call stack, undo operations, DFS. In Python: use list as stack. Time: O(1) push/pop."},
    {"language": "general", "concept": "queues", "text": "QUEUE (FIFO): First-In-First-Out. Use collections.deque in Python for O(1) append and popleft. Use cases: BFS, scheduling, print queues. Never use list for queue (pop(0) is O(n))."},

    # ── Algorithms ───────────────────────────────────────────────────────────
    {"language": "general", "concept": "binary_search", "text": "BINARY SEARCH: Only works on sorted arrays. Time: O(log n). Template: lo, hi = 0, len(arr)-1; while lo<=hi: mid=(lo+hi)//2; if arr[mid]==target: return mid; elif arr[mid]<target: lo=mid+1; else: hi=mid-1. Common bug: lo+hi overflow (use lo+(hi-lo)//2 in other languages)."},
    {"language": "general", "concept": "sorting", "text": "SORTING COMPLEXITY: Bubble/Selection/Insertion: O(n²). Merge/Heap: O(n log n). Quick: O(n log n) avg, O(n²) worst. Python's sorted() uses TimSort O(n log n). For nearly sorted data, insertion sort is efficient. Use key= parameter for custom sort."},
    {"language": "general", "concept": "dynamic_programming", "text": "DYNAMIC PROGRAMMING: Solve overlapping subproblems. Two approaches: (1) Top-down with memoization (recursive + cache). (2) Bottom-up with tabulation (iterative + dp array). Identify: optimal substructure + overlapping subproblems. Classic problems: Fibonacci, knapsack, LCS, coin change."},
    {"language": "general", "concept": "two_pointers", "text": "TWO POINTER TECHNIQUE: Use two indices to traverse array. Reduces O(n²) to O(n). Patterns: (1) Left+right moving toward center (palindrome check, container with water). (2) Slow+fast pointers (cycle detection). (3) Both starting from left at different speeds (sliding window)."},

    # ── Clean Code ───────────────────────────────────────────────────────────
    {"language": "general", "concept": "naming_issue", "text": "NAMING CONVENTIONS: Variables/functions: snake_case. Classes: PascalCase. Constants: UPPER_CASE. Bad: x, tmp, data2, fn. Good: user_count, is_valid, calculate_area. Names should be self-documenting. Avoid single-letter variables except loop indices (i, j, k)."},
    {"language": "general", "concept": "code_complexity", "text": "REDUCING COMPLEXITY: (1) Extract repeated code into functions. (2) Limit nesting to 3 levels max. (3) Single Responsibility Principle. (4) Replace complex conditionals with guard clauses (early returns). (5) Use meaningful names to eliminate comments. (6) Keep functions under 20 lines."},
    {"language": "python", "concept": "performance", "text": "PYTHON PERFORMANCE TIPS: (1) Use list comprehension over for-loop. (2) Use sets for O(1) lookup instead of list. (3) Use join() for string concatenation, not +. (4) Use generators for large data. (5) Avoid global variables in loops. (6) Profile before optimizing."},

    # ── OOP ──────────────────────────────────────────────────────────────────
    {"language": "python", "concept": "object_oriented_programming", "text": "PYTHON OOP: (1) __init__ is the constructor. (2) self must be the first parameter of all methods. (3) Use @property for getters. (4) Inheritance: class Child(Parent). (5) super().__init__() calls parent constructor. (6) @staticmethod and @classmethod for class-level methods."},
    {"language": "python", "concept": "object_oriented_programming", "text": "OOP COMMON ERRORS: (1) Mutable default argument: def __init__(self, items=[]). Use items=None then items=[] inside. (2) Forgetting self in method call: self.method(). (3) Not calling super().__init__(). (4) Confusing class variables (shared) with instance variables (per-object)."},

    # ── Error Handling ───────────────────────────────────────────────────────
    {"language": "python", "concept": "runtime_error", "text": "EXCEPTION HANDLING: Use specific exceptions not bare except. try/except/else/finally pattern. Raise custom exceptions with raise ValueError('message'). Log exceptions don't swallow them. ZeroDivisionError, IndexError, KeyError, ValueError, TypeError are the most common in interviews."},
    {"language": "python", "concept": "runtime_error", "text": "NONE HANDLING: NoneType has no attributes/methods. Always check 'if result is not None' before using. Functions that don't explicitly return a value return None. Common: s = some_function() then s.upper() → AttributeError if s is None."},
]


async def build_index():
    """Build and save the FAISS index."""
    try:
        import faiss
        import numpy as np
    except ImportError:
        logger.error("faiss or numpy not installed. Run: pip install faiss-cpu numpy")
        return

    from openai import AsyncOpenAI
    from app.config import get_settings

    settings = get_settings()
    if not settings.openai_api_key or settings.openai_api_key == "your_openai_api_key_here":
        logger.error("OPENAI_API_KEY not set in .env file.")
        return

    client = AsyncOpenAI(api_key=settings.openai_api_key)

    logger.info("Embedding %d knowledge chunks...", len(CHUNKS))
    texts = [c["text"] for c in CHUNKS]

    # Batch embed (max 100 per API call)
    vectors = []
    BATCH_SIZE = 50
    for i in range(0, len(texts), BATCH_SIZE):
        batch = texts[i:i + BATCH_SIZE]
        response = await client.embeddings.create(
            model=settings.embedding_model,
            input=batch,
        )
        vectors.extend([d.embedding for d in response.data])
        logger.info("Embedded %d/%d chunks", min(i + BATCH_SIZE, len(texts)), len(texts))

    # Build FAISS index
    dim = len(vectors[0])
    index = faiss.IndexFlatL2(dim)
    matrix = np.array(vectors, dtype=np.float32)
    index.add(matrix)

    # Save index and metadata
    index_dir = Path(settings.faiss_index_path).parent
    index_dir.mkdir(parents=True, exist_ok=True)
    faiss.write_index(index, settings.faiss_index_path)

    meta_path = index_dir / "metadata.json"
    with open(meta_path, "w") as f:
        json.dump(CHUNKS, f, indent=2)

    logger.info(
        "✅ FAISS index built with %d vectors → %s",
        index.ntotal,
        settings.faiss_index_path,
    )


if __name__ == "__main__":
    asyncio.run(build_index())
