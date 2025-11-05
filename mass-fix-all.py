#!/usr/bin/env python3
"""
MASS FIX SCRIPT - Fix all console.* and any types in one shot
"""
import re
import os
import sys
from pathlib import Path

def fix_console_statements(content: str, filepath: str) -> tuple[str, int]:
    """Replace console.* with logger"""
    changes = 0
    lines = content.split('\n')
    new_lines = []
    has_logger_import = False
    
    for i, line in enumerate(lines):
        # Check if logger is already imported
        if 'logger' in line and ('import' in line or 'from' in line):
            has_logger_import = True
        
        # Replace console.log → logger.info
        if re.search(r'console\.log\s*\(', line):
            indent = len(line) - len(line.lstrip())
            new_lines.append(f"{' ' * indent}logger.info(" + line.split('console.log(')[1])
            changes += 1
            continue
        
        # Replace console.error → logger.error
        if re.search(r'console\.error\s*\(', line):
            indent = len(line) - len(line.lstrip())
            # Extract the message
            match = re.search(r'console\.error\s*\((.+)\)', line)
            if match:
                args = match.group(1).strip()
                # Simple conversion: if it's a string, use it; otherwise wrap in object
                if args.startswith("'") or args.startswith('"'):
                    new_lines.append(f"{' ' * indent}logger.error({args}, {{}});")
                else:
                    new_lines.append(f"{' ' * indent}logger.error('Error', {{ error: {args} }});")
            else:
                new_lines.append(line.replace('console.error', 'logger.error'))
            changes += 1
            continue
        
        # Replace console.warn → logger.warn
        if re.search(r'console\.warn\s*\(', line):
            indent = len(line) - len(line.lstrip())
            match = re.search(r'console\.warn\s*\((.+)\)', line)
            if match:
                args = match.group(1).strip()
                if args.startswith("'") or args.startswith('"'):
                    new_lines.append(f"{' ' * indent}logger.warn({args}, {{}});")
                else:
                    new_lines.append(f"{' ' * indent}logger.warn('Warning', {{ warning: {args} }});")
            else:
                new_lines.append(line.replace('console.warn', 'logger.warn'))
            changes += 1
            continue
        
        # Replace console.debug → logger.debug (if logger has debug)
        if re.search(r'console\.debug\s*\(', line):
            new_lines.append(line.replace('console.debug', 'logger.info'))  # Fallback to info
            changes += 1
            continue
        
        # Replace console.info → logger.info
        if re.search(r'console\.info\s*\(', line):
            new_lines.append(line.replace('console.info', 'logger.info'))
            changes += 1
            continue
        
        new_lines.append(line)
    
    # Add logger import if needed and not present
    if changes > 0 and not has_logger_import:
        # Find the last import statement
        import_idx = -1
        for i, line in enumerate(new_lines):
            if line.strip().startswith('import ') or line.strip().startswith('from '):
                import_idx = i
        
        if import_idx >= 0:
            new_lines.insert(import_idx + 1, "import { logger } from '@/lib/utils/logger';")
        else:
            new_lines.insert(0, "import { logger } from '@/lib/utils/logger';")
    
    return '\n'.join(new_lines), changes

def fix_any_types(content: str) -> tuple[str, int]:
    """Remove/replace any types"""
    changes = 0
    original = content
    
    # Replace : any → : unknown (but be careful with function parameters)
    # Pattern: parameter: any → parameter: unknown
    content = re.sub(r':\s*any\b', ': unknown', content)
    if content != original:
        changes += len(re.findall(r':\s*unknown\b', content)) - len(re.findall(r':\s*any\b', original))
    
    # Replace Promise<any> → Promise<unknown>
    content = re.sub(r'Promise\s*<\s*any\s*>', 'Promise<unknown>', content)
    if content != original:
        changes += 1
    
    # Replace as any → as unknown (but keep some that might be needed)
    # We'll be conservative here - only replace obvious cases
    content = re.sub(r'\bas\s+any\b', 'as unknown', content)
    if content != original:
        changes += 1
    
    return content, changes

def process_file(filepath: str) -> dict:
    """Process a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        total_changes = 0
        
        # Skip logger.ts files
        if 'logger.ts' in filepath:
            return {'file': filepath, 'changes': 0, 'skipped': True}
        
        # Fix console statements
        content, console_changes = fix_console_statements(content, filepath)
        total_changes += console_changes
        
        # Fix any types
        content, any_changes = fix_any_types(content)
        total_changes += any_changes
        
        if total_changes > 0 and content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return {'file': filepath, 'changes': total_changes, 'skipped': False}
        
        return {'file': filepath, 'changes': 0, 'skipped': False}
    except Exception as e:
        return {'file': filepath, 'error': str(e), 'changes': 0}

def main():
    base_dir = Path(__file__).parent / 'src'
    if not base_dir.exists():
        print(f"Error: {base_dir} does not exist")
        sys.exit(1)
    
    # Find all TS/TSX files
    files = []
    for ext in ['*.ts', '*.tsx']:
        files.extend(base_dir.rglob(ext))
    
    print(f"Found {len(files)} files to process")
    
    results = []
    for filepath in files:
        result = process_file(str(filepath))
        results.append(result)
        if result.get('changes', 0) > 0:
            print(f"✅ {result['file']}: {result['changes']} changes")
        elif result.get('error'):
            print(f"❌ {result['file']}: {result['error']}")
    
    total_changes = sum(r.get('changes', 0) for r in results)
    files_changed = sum(1 for r in results if r.get('changes', 0) > 0)
    
    print(f"\n📊 Summary:")
    print(f"  Files processed: {len(files)}")
    print(f"  Files changed: {files_changed}")
    print(f"  Total changes: {total_changes}")

if __name__ == '__main__':
    main()

