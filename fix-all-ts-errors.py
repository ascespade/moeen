#!/usr/bin/env python3
"""
TypeScript Error Fixer - Automated fixer for all TS errors
Fixes unused variables and imports systematically
"""

import re
import subprocess
import sys
from pathlib import Path

def run_tsc():
    """Run TypeScript compiler and get errors"""
    result = subprocess.run(
        ['npx', 'tsc', '--noEmit'],
        capture_output=True,
        text=True,
        cwd='/home/ubuntu/moeen'
    )
    return result.stderr

def parse_errors(errors):
    """Parse TypeScript errors into structured format"""
    unused_vars = []
    unused_imports = []
    critical = []
    
    for line in errors.split('\n'):
        if 'error TS6133' in line:  # Unused variable
            match = re.search(r'^([^:]+)\((\d+),(\d+)\):.*\'([^\']+)\'', line)
            if match:
                unused_vars.append({
                    'file': match.group(1),
                    'line': int(match.group(2)),
                    'col': int(match.group(3)),
                    'var': match.group(4)
                })
        elif 'error TS6192' in line:  # Unused import
            match = re.search(r'^([^:]+)\((\d+),(\d+)\):', line)
            if match:
                unused_imports.append({
                    'file': match.group(1),
                    'line': int(match.group(2)),
                    'col': int(match.group(3))
                })
        elif 'error TS' in line:
            critical.append(line)
    
    return unused_vars, unused_imports, critical

def fix_unused_var(file_path, line_num, var_name):
    """Fix unused variable by prefixing with underscore"""
    try:
        file = Path(file_path)
        if not file.exists():
            return False
        
        lines = file.read_text().split('\n')
        if line_num > len(lines):
            return False
        
        line = lines[line_num - 1]
        
        # Skip if already prefixed
        if var_name.startswith('_'):
            return False
        
        # Replace variable (be careful with word boundaries)
        # Replace exact matches
        pattern = r'\b' + re.escape(var_name) + r'\b'
        
        # Check if it's a destructuring pattern
        if '=' in line and var_name in line:
            # For destructuring, replace carefully
            new_line = re.sub(pattern, '_' + var_name, line)
            if new_line != line:
                lines[line_num - 1] = new_line
                file.write_text('\n'.join(lines))
                return True
        
        return False
    except Exception as e:
        print(f"Error fixing {file_path}:{line_num}: {e}")
        return False

def fix_unused_import(file_path, line_num):
    """Comment out unused import"""
    try:
        file = Path(file_path)
        if not file.exists():
            return False
        
        lines = file.read_text().split('\n')
        if line_num > len(lines):
            return False
        
        line = lines[line_num - 1]
        
        # Skip if already commented
        if line.strip().startswith('//'):
            return False
        
        # Comment out the line
        lines[line_num - 1] = '// ' + line
        file.write_text('\n'.join(lines))
        return True
    except Exception as e:
        print(f"Error fixing import {file_path}:{line_num}: {e}")
        return False

def main():
    print("=== TypeScript Error Fixer ===")
    print("Starting...\n")
    
    iteration = 0
    max_iterations = 50
    last_count = 999999
    
    while iteration < max_iterations:
        iteration += 1
        print(f"\n=== Iteration {iteration} ===")
        
        # Get errors
        errors = run_tsc()
        unused_vars, unused_imports, critical = parse_errors(errors)
        
        total = len(unused_vars) + len(unused_imports) + len(critical)
        print(f"Total errors: {total}")
        print(f"  - Unused variables: {len(unused_vars)}")
        print(f"  - Unused imports: {len(unused_imports)}")
        print(f"  - Critical: {len(critical)}")
        
        if total == 0:
            print("\n✅ All errors fixed!")
            break
        
        if total == last_count:
            print("\n⚠️  No progress made. Stopping.")
            break
        
        last_count = total
        
        # Fix unused variables
        fixed_vars = 0
        for var_info in unused_vars[:50]:  # Process 50 at a time
            if fix_unused_var(var_info['file'], var_info['line'], var_info['var']):
                fixed_vars += 1
        
        # Fix unused imports
        fixed_imports = 0
        for imp_info in unused_imports[:20]:  # Process 20 at a time
            if fix_unused_import(imp_info['file'], imp_info['line']):
                fixed_imports += 1
        
        print(f"Fixed: {fixed_vars} variables, {fixed_imports} imports")
        
        if fixed_vars == 0 and fixed_imports == 0:
            print("\n⚠️  No fixes made. Moving to critical errors...")
            break
    
    # Final report
    print("\n=== Final Report ===")
    errors = run_tsc()
    unused_vars, unused_imports, critical = parse_errors(errors)
    total = len(unused_vars) + len(unused_imports) + len(critical)
    
    print(f"Remaining errors: {total}")
    if total > 0:
        print(f"  - Unused variables: {len(unused_vars)}")
        print(f"  - Unused imports: {len(unused_imports)}")
        print(f"  - Critical: {len(critical)}")
        
        if len(critical) > 0:
            print("\nFirst 10 critical errors:")
            for err in critical[:10]:
                print(f"  {err}")

if __name__ == '__main__':
    main()
