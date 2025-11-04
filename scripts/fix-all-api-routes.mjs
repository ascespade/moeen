#!/usr/bin/env node

/**
 * Fix All API Routes
 * ????? ???? API routes
 */

import fs from 'fs';
import { glob } from 'glob';

async function fixApiRoutes() {
  console.log('?? Fixing all API routes...\n');
  
  const apiFiles = await glob('src/app/api/**/*.ts');
  let fixedCount = 0;
  
  for (const file of apiFiles) {
    let content = fs.readFileSync(file, 'utf-8');
    let modified = false;
    
    // 1. Add return types
    if (content.includes('export async function') && 
        content.includes('request: NextRequest') && 
        !content.includes('Promise<NextResponse>')) {
      
      content = content.replace(
        /(export async function (GET|POST|PUT|DELETE|PATCH))\(request: NextRequest\)/g,
        '$1(request: NextRequest): Promise<NextResponse>'
      );
      modified = true;
    }
    
    // 2. Add error handling if missing
    if (content.includes('export async function') && 
        !content.includes('try {') && 
        content.includes('await') &&
        !content.includes('// Skip error handling')) {
      
      // Check if function has return statement
      const hasReturn = content.match(/export async function \w+[^{]*\{[\s\S]*?return/);
      
      if (hasReturn) {
        // Wrap function body in try-catch
        const funcMatch = content.match(/(export async function \w+[^{]*\{)([\s\S]*?)(\n\})/);
        if (funcMatch) {
          const [, funcStart, body, funcEnd] = funcMatch;
          
          // Check if already has try-catch
          if (!body.includes('try {')) {
            const indentedBody = body.split('\n').map((line, i) => {
              // Skip first line (function declaration)
              if (i === 0) return line;
              return '    ' + line;
            }).join('\n');
            
            const newBody = `\n  try {${indentedBody}\n  } catch (error) {\n    return NextResponse.json(\n      { error: error instanceof Error ? error.message : 'Internal server error' },\n      { status: 500 }\n    );\n  }`;
            
            content = content.replace(funcMatch[0], funcStart + newBody + funcEnd);
            modified = true;
          }
        }
      }
    }
    
    // 3. Add missing imports
    if (content.includes('NextResponse.json') && !content.includes("import { NextResponse }")) {
      if (content.includes('import { NextRequest')) {
        content = content.replace(
          /import \{ NextRequest \}/,
          'import { NextRequest, NextResponse }'
        );
      } else if (content.includes("from 'next/server'")) {
        content = content.replace(
          /from 'next\/server'/,
          "import { NextRequest, NextResponse } from 'next/server'"
        );
      }
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(file, content);
      fixedCount++;
      console.log(`? Fixed: ${file}`);
    }
  }
  
  console.log(`\n? Fixed ${fixedCount} API route files`);
  return fixedCount;
}

fixApiRoutes().catch(console.error);
