"""
fix_annotations.py
Add 'from __future__ import annotations' to all Python files that need it.
Run once: python fix_annotations.py
"""
from pathlib import Path

roots = [Path('app'), Path('knowledge_base')]
FUTURE_LINE = 'from __future__ import annotations\n'

def fix_file(f: Path):
    text = f.read_text(encoding='utf-8')
    if 'from __future__ import annotations' in text:
        return False  # already has it

    lines = text.splitlines(keepends=True)
    insert_at = 0

    # Skip docstrings at the start
    i = 0
    if lines and lines[0].strip().startswith('"""'):
        # Multi-line docstring
        if lines[0].strip().endswith('"""') and len(lines[0].strip()) > 6:
            insert_at = 1  # single-line docstring
        else:
            for j in range(1, len(lines)):
                if '"""' in lines[j]:
                    insert_at = j + 1
                    break
    elif lines and lines[0].strip().startswith("'''"):
        if lines[0].strip().endswith("'''") and len(lines[0].strip()) > 6:
            insert_at = 1
        else:
            for j in range(1, len(lines)):
                if "'''" in lines[j]:
                    insert_at = j + 1
                    break

    lines.insert(insert_at, FUTURE_LINE)
    f.write_text(''.join(lines), encoding='utf-8')
    return True


fixed = []
for root in roots:
    for f in root.rglob('*.py'):
        if fix_file(f):
            fixed.append(str(f))

print(f'Fixed {len(fixed)} files:')
for f in fixed:
    print(f'  {f}')
