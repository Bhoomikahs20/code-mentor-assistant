"""
fix_unions.py – Replace 'X | None' with 'Optional[X]' for Python 3.8 compatibility.
Run: python fix_unions.py
"""
import re
from pathlib import Path

roots = [Path('app'), Path('knowledge_base')]

# Pattern: match 'dict | None' or 'list | None' etc. in type annotations
# Replace e.g. `-> dict | None:` with `-> Optional[dict]:`
UNION_PATTERN = re.compile(r'(\w+)\s*\|\s*None')

def fix_file(f: Path) -> bool:
    text = f.read_text(encoding='utf-8')
    
    # Check if this is a model file - those were fully rewritten already
    if f.parent.name == 'models':
        return False
    
    # Replace X | None with Optional[X]
    new_text = UNION_PATTERN.sub(r'Optional[\1]', text)
    
    # Ensure Optional is imported from typing if we made replacements
    if new_text != text:
        if 'from typing import' in new_text:
            # Add Optional to existing typing import if not already there
            def add_optional(m):
                imports = m.group(1)
                if 'Optional' not in imports:
                    return f'from typing import {imports}, Optional'
                return m.group(0)
            new_text = re.sub(r'from typing import (.+)', add_optional, new_text)
        elif 'from __future__' in new_text or 'import' in new_text:
            # Add it after __future__ import
            lines = new_text.splitlines(keepends=True)
            # Find after future import or first actual import
            insert_pos = 0
            for i, line in enumerate(lines):
                if 'from __future__' in line:
                    insert_pos = i + 1
                    break
                elif line.strip().startswith('import ') or line.strip().startswith('from '):
                    insert_pos = i
                    break
            lines.insert(insert_pos, 'from typing import Optional\n')
            new_text = ''.join(lines)
        
        f.write_text(new_text, encoding='utf-8')
        return True
    return False

fixed = []
for root in roots:
    for f in root.rglob('*.py'):
        if fix_file(f):
            fixed.append(str(f))

print(f'Fixed {len(fixed)} files:')
for f in fixed:
    print(f'  {f}')
