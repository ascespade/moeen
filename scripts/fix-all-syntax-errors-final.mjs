#!/usr/bin/env node

/**
 * Fix All Remaining Syntax Errors
 * ????? ???? ????? Syntax ????????
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('?? Fixing All Remaining Syntax Errors...\n');

const allFiles = await glob('src/**/*.{ts,tsx}', { cwd: projectRoot });
let fixedCount = 0;

for (const file of allFiles) {
  const filePath = join(projectRoot, file);
  try {
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;

    // Fix: buttononClick -> button onClick
    if (content.includes('buttononClick')) {
      content = content.replace(/buttononClick/g, 'button onClick');
      modified = true;
    }

    // Fix: buttonkey -> button key
    if (content.includes('buttonkey')) {
      content = content.replace(/buttonkey/g, 'button key');
      modified = true;
    }

    // Fix: onClick={() = aria-label="Button"> -> onClick={() => {
    if (content.includes('onClick={() = aria-label="Button">')) {
      content = content.replace(/onClick=\{\(\) = aria-label="Button">/g, 'onClick={() => {');
      modified = true;
    }

    // Fix: = aria-label="Button"> -> aria-label="Button"
    if (content.includes('= aria-label="Button">')) {
      content = content.replace(/= aria-label="Button">/g, 'aria-label="Button"');
      modified = true;
    }

    // Fix: </main> where should be </div>
    if (content.includes('</main>') && content.match(/<\/main>/g)?.length > content.match(/<main/g)?.length) {
      // Find and fix extra </main>
      const mainCount = (content.match(/<main/g) || []).length;
      const mainCloseCount = (content.match(/<\/main>/g) || []).length;
      if (mainCloseCount > mainCount) {
        // Replace first extra </main> with </div>
        content = content.replace(/<\/main>/, '</div>');
        modified = true;
      }
    }

    // Fix: </nav> where should be </div>
    const navCount = (content.match(/<nav/g) || []).length;
    const navCloseCount = (content.match(/<\/nav>/g) || []).length;
    if (navCloseCount > navCount) {
      content = content.replace(/<\/nav>/, '</div>');
      modified = true;
    }

    // Fix: </header> where should be </div>
    const headerCount = (content.match(/<header/g) || []).length;
    const headerCloseCount = (content.match(/<\/header>/g) || []).length;
    if (headerCloseCount > headerCount) {
      content = content.replace(/<\/header>/, '</div>');
      modified = true;
    }

    // Fix: </footer> where should be </div>
    const footerCount = (content.match(/<footer/g) || []).length;
    const footerCloseCount = (content.match(/<\/footer>/g) || []).length;
    if (footerCloseCount > footerCount) {
      content = content.replace(/<\/footer>/, '</div>');
      modified = true;
    }

    if (modified) {
      writeFileSync(filePath, content, 'utf-8');
      fixedCount++;
      if (fixedCount <= 20) {
        console.log(`  ? Fixed: ${file}`);
      }
    }
  } catch (error) {
    // Skip
  }
}

console.log(`\n?? Summary: Fixed ${fixedCount} files\n`);
