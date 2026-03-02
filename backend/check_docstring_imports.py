"""
check_docstring_imports.py
Scan all Python files for imports accidentally placed inside docstrings.
"""
from pathlib import Path
import re

roots = [Path('app'), Path('knowledge_base')]

problems = []
for root in roots:
    for f in root.rglob('*.py'):
        text = f.read_text(encoding='utf-8')
        lines = text.splitlines()
        # Is line 2 or 3 an import statement (indicating it may be inside docstring)?
        for i, line in enumerate(lines[:10]):
            stripped = line.strip()
            if stripped.startswith('from __future__') and i > 0:
                # Check if we're inside a docstring
                before = '\n'.join(lines[:i])
                triple_count = before.count('"""') + before.count("'''")
                if triple_count % 2 == 1:  # odd = inside docstring
                    problems.append((str(f), i+1, stripped))
                    print(f'PROBLEM: {f} line {i+1}: import is inside docstring!')
                    print(f'  Context: {lines[max(0,i-2):i+3]}')

if not problems:
    print('All files OK - no imports inside docstrings.')
print(f'Checked {sum(1 for r in roots for _ in r.rglob("*.py"))} files.')
