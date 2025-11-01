#!/usr/bin/env ts-node
/**
 * i18n & Translation Checker Script
 * Part of Daddy Dodi Framework AI
 * 
 * This script checks for:
 * 1. Hardcoded strings in the codebase
 * 2. Missing translations in the database
 * 3. Unused translation keys
 * 4. Translation coverage statistics
 */

import fs from 'fs';
import path from 'path';

interface HardcodedString {
  file: string;
  line: number;
  content: string;
  context: string;
  type: 'arabic' | 'english';
}

interface TranslationKey {
  key: string;
  ar?: string;
  en?: string;
  namespace: string;
  usedInFiles: string[];
}

interface I18nCheckResult {
  summary: {
    totalFiles: number;
    filesWithHardcoded: number;
    totalHardcodedStrings: number;
    arabicStrings: number;
    englishStrings: number;
    totalTranslationKeys: number;
    translationCoverage: number;
    missingTranslations: number;
    unusedTranslations: number;
  };
  hardcodedStrings: HardcodedString[];
  translationKeys: TranslationKey[];
  missingTranslations: string[];
  unusedTranslations: string[];
  recommendations: string[];
}

class I18nChecker {
  private srcPath: string;
  private hardcodedStrings: HardcodedString[] = [];
  private translationKeys: Map<string, TranslationKey> = new Map();
  private usedKeys: Set<string> = new Set();
  
  // Patterns to detect hardcoded strings
  private arabicPattern = /[\u0600-\u06FF]+/;
  private stringPatterns = [
    // JSX text content
    />\s*([A-Z][a-zA-Z\s]{3,})\s*</g,
    // String literals with Arabic
    /['"]([^'"]*[\u0600-\u06FF][^'"]*)['"]/g,
    // String literals with English (title case or multiple words)
    /['"]([A-Z][a-z]+(?:\s+[A-Za-z]+)+)['"]/g,
  ];

  // Patterns to detect translation usage
  private translationUsagePatterns = [
    /t\(['"]([^'"]+)['"]/g,
    /useTranslation\(\)/g,
    /translationService\.get\(['"]([^'"]+)['"]/g,
  ];

  // Files and directories to ignore
  private ignorePatterns = [
    'node_modules',
    '.next',
    'dist',
    'build',
    '.git',
    'coverage',
    'public',
    '.test.',
    '.spec.',
  ];

  constructor(srcPath: string = '/workspace/src') {
    this.srcPath = srcPath;
  }

  async run(): Promise<I18nCheckResult> {
    console.log('🔍 Starting i18n check...\n');

    // Step 1: Scan codebase for hardcoded strings
    console.log('📂 Scanning codebase for hardcoded strings...');
    await this.scanDirectory(this.srcPath);
    console.log(`   Found ${this.hardcodedStrings.length} hardcoded strings\n`);

    // Step 2: Load translations from database
    console.log('🗄️  Loading translations from database...');
    await this.loadTranslationsFromDB();
    console.log(`   Found ${this.translationKeys.size} translation keys\n`);

    // Step 3: Analyze results
    console.log('📊 Analyzing results...');
    const result = this.generateReport();
    
    return result;
  }

  private async scanDirectory(dir: string): Promise<void> {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      // Skip ignored patterns
      if (this.shouldIgnore(fullPath)) continue;

      if (entry.isDirectory()) {
        await this.scanDirectory(fullPath);
      } else if (this.isRelevantFile(entry.name)) {
        await this.scanFile(fullPath);
      }
    }
  }

  private shouldIgnore(filePath: string): boolean {
    return this.ignorePatterns.some(pattern => filePath.includes(pattern));
  }

  private isRelevantFile(filename: string): boolean {
    return /\.(tsx?|jsx?)$/.test(filename);
  }

  private async scanFile(filePath: string): Promise<void> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const relativePath = path.relative('/workspace', filePath);

    // Check for translation usage
    for (const pattern of this.translationUsagePatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        if (match[1]) {
          this.usedKeys.add(match[1]);
        }
      }
    }

    // Check for hardcoded strings
    lines.forEach((line, lineNumber) => {
      // Skip comments and imports
      if (line.trim().startsWith('//') || 
          line.trim().startsWith('*') || 
          line.includes('import ') ||
          line.includes('export ') ||
          line.includes('console.')) {
        return;
      }

      // Check for Arabic strings
      const arabicMatches = line.match(/['"]([^'"]*[\u0600-\u06FF][^'"]*)['"]/g);
      if (arabicMatches) {
        arabicMatches.forEach(match => {
          const content = match.slice(1, -1); // Remove quotes
          this.hardcodedStrings.push({
            file: relativePath,
            line: lineNumber + 1,
            content,
            context: line.trim().substring(0, 100),
            type: 'arabic',
          });
        });
      }

      // Check for English strings (title case, multiple words)
      const englishMatches = line.match(/['"]([A-Z][a-z]+(?:\s+[A-Za-z]+)+)['"]/g);
      if (englishMatches) {
        englishMatches.forEach(match => {
          const content = match.slice(1, -1);
          // Ignore common technical terms and imports
          if (!this.isCommonTechnicalTerm(content)) {
            this.hardcodedStrings.push({
              file: relativePath,
              line: lineNumber + 1,
              content,
              context: line.trim().substring(0, 100),
              type: 'english',
            });
          }
        });
      }

      // Check for JSX text content
      const jsxMatches = line.match(/>\s*([A-Z][a-zA-Z\s]{5,})\s*</g);
      if (jsxMatches) {
        jsxMatches.forEach(match => {
          const content = match.replace(/[><]/g, '').trim();
          if (!this.isCommonTechnicalTerm(content)) {
            this.hardcodedStrings.push({
              file: relativePath,
              line: lineNumber + 1,
              content,
              context: line.trim().substring(0, 100),
              type: 'english',
            });
          }
        });
      }
    });
  }

  private isCommonTechnicalTerm(text: string): boolean {
    const technicalTerms = [
      'React', 'Component', 'TypeScript', 'JavaScript', 'Node',
      'Next', 'Supabase', 'Database', 'API', 'HTTP', 'URL',
      'JSON', 'CSV', 'PDF', 'PNG', 'JPG', 'SVG',
      'Email', 'Password', 'Username', 'Token',
      'Loading', 'Error', 'Success', 'Warning',
      'Google', 'Facebook', 'Twitter', 'Instagram',
      'WhatsApp', 'Telegram', 'Slack',
    ];

    return technicalTerms.some(term => 
      text.toLowerCase().includes(term.toLowerCase())
    );
  }

  private async loadTranslationsFromDB(): Promise<void> {
    try {
      // Try to load from SQL files if Supabase is not available
      const translationsFile = path.join('/workspace', 'src', 'lib', 'i18n.sql');
      
      if (fs.existsSync(translationsFile)) {
        const content = fs.readFileSync(translationsFile, 'utf-8');
        this.parseTranslationsFromSQL(content);
      }
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  }

  private parseTranslationsFromSQL(sql: string): void {
    // Parse INSERT statements
    const insertRegex = /\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)'\)/g;
    let match;

    while ((match = insertRegex.exec(sql)) !== null) {
      const [, locale, namespace, key, value] = match;
      const fullKey = `${namespace}.${key}`;
      
      const existing = this.translationKeys.get(fullKey);
      if (existing) {
        if (locale === 'ar') existing.ar = value;
        if (locale === 'en') existing.en = value;
      } else {
        this.translationKeys.set(fullKey, {
          key: fullKey,
          ar: locale === 'ar' ? value : undefined,
          en: locale === 'en' ? value : undefined,
          namespace,
          usedInFiles: [],
        });
      }
    }
  }

  private generateReport(): I18nCheckResult {
    const arabicStrings = this.hardcodedStrings.filter(s => s.type === 'arabic');
    const englishStrings = this.hardcodedStrings.filter(s => s.type === 'english');
    
    const missingTranslations: string[] = [];
    const unusedTranslations: string[] = [];

    // Check for missing translations
    this.translationKeys.forEach((translation, key) => {
      if (!translation.ar || !translation.en) {
        missingTranslations.push(key);
      }
      if (!this.usedKeys.has(key)) {
        unusedTranslations.push(key);
      }
    });

    const filesWithHardcoded = new Set(this.hardcodedStrings.map(s => s.file)).size;
    const totalFiles = this.countTotalFiles(this.srcPath);

    const coverage = this.translationKeys.size > 0 
      ? ((this.translationKeys.size - missingTranslations.length) / this.translationKeys.size) * 100 
      : 0;

    const recommendations = this.generateRecommendations(
      this.hardcodedStrings.length,
      missingTranslations.length,
      unusedTranslations.length
    );

    return {
      summary: {
        totalFiles,
        filesWithHardcoded,
        totalHardcodedStrings: this.hardcodedStrings.length,
        arabicStrings: arabicStrings.length,
        englishStrings: englishStrings.length,
        totalTranslationKeys: this.translationKeys.size,
        translationCoverage: Math.round(coverage * 100) / 100,
        missingTranslations: missingTranslations.length,
        unusedTranslations: unusedTranslations.length,
      },
      hardcodedStrings: this.hardcodedStrings.slice(0, 100), // Limit to first 100
      translationKeys: Array.from(this.translationKeys.values()),
      missingTranslations,
      unusedTranslations,
      recommendations,
    };
  }

  private countTotalFiles(dir: string): number {
    let count = 0;
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (this.shouldIgnore(fullPath)) continue;
        
        if (entry.isDirectory()) {
          count += this.countTotalFiles(fullPath);
        } else if (this.isRelevantFile(entry.name)) {
          count++;
        }
      }
    } catch (error) {
      // Ignore errors
    }
    return count;
  }

  private generateRecommendations(
    hardcodedCount: number,
    missingCount: number,
    unusedCount: number
  ): string[] {
    const recommendations: string[] = [];

    if (hardcodedCount > 50) {
      recommendations.push(
        `⚠️  عدد كبير من النصوص الثابتة (${hardcodedCount}). يُنصح بشدة بنقلها إلى نظام الترجمة.`
      );
    } else if (hardcodedCount > 0) {
      recommendations.push(
        `✅ عدد معتدل من النصوص الثابتة (${hardcodedCount}). يمكن معالجتها تدريجياً.`
      );
    } else {
      recommendations.push(
        '🎉 ممتاز! لا توجد نصوص ثابتة في الكود.'
      );
    }

    if (missingCount > 20) {
      recommendations.push(
        `⚠️  العديد من الترجمات ناقصة (${missingCount}). يجب إكمالها في قاعدة البيانات.`
      );
    } else if (missingCount > 0) {
      recommendations.push(
        `📝 بعض الترجمات ناقصة (${missingCount}). يُنصح بإكمالها.`
      );
    }

    if (unusedCount > 50) {
      recommendations.push(
        `🧹 توجد ترجمات غير مستخدمة (${unusedCount}). يمكن مراجعتها وحذف غير الضروري.`
      );
    }

    recommendations.push(
      '💡 استخدم نظام useTranslation() أو translationService لجميع النصوص القابلة للترجمة.'
    );

    recommendations.push(
      '🔄 تأكد من تحديث جدول translations في Supabase بانتظام.'
    );

    return recommendations;
  }
}

async function main() {
  const checker = new I18nChecker();
  const result = await checker.run();

  // Create logs directory
  const logsDir = path.join('/workspace', 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  // Save results to JSON files
  console.log('\n💾 Saving results...\n');

  fs.writeFileSync(
    path.join(logsDir, 'i18n_check.json'),
    JSON.stringify(result, null, 2),
    'utf-8'
  );

  fs.writeFileSync(
    path.join(logsDir, 'translation_report.json'),
    JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: result.summary,
      recommendations: result.recommendations,
    }, null, 2),
    'utf-8'
  );

  fs.writeFileSync(
    path.join(logsDir, 'missing_translations.json'),
    JSON.stringify({
      timestamp: new Date().toISOString(),
      count: result.missingTranslations.length,
      keys: result.missingTranslations,
    }, null, 2),
    'utf-8'
  );

  // Print summary
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📊 i18n & Translation Check Report');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log('📈 Summary:');
  console.log(`   Total Files Scanned: ${result.summary.totalFiles}`);
  console.log(`   Files with Hardcoded Strings: ${result.summary.filesWithHardcoded}`);
  console.log(`   Total Hardcoded Strings: ${result.summary.totalHardcodedStrings}`);
  console.log(`      ├─ Arabic: ${result.summary.arabicStrings}`);
  console.log(`      └─ English: ${result.summary.englishStrings}`);
  console.log(`   Translation Keys in DB: ${result.summary.totalTranslationKeys}`);
  console.log(`   Translation Coverage: ${result.summary.translationCoverage}%`);
  console.log(`   Missing Translations: ${result.summary.missingTranslations}`);
  console.log(`   Unused Translations: ${result.summary.unusedTranslations}\n`);

  console.log('💡 Recommendations:');
  result.recommendations.forEach(rec => console.log(`   ${rec}`));
  
  console.log('\n📁 Reports saved to:');
  console.log(`   - logs/i18n_check.json`);
  console.log(`   - logs/translation_report.json`);
  console.log(`   - logs/missing_translations.json`);
  console.log('\n✅ Check complete!\n');
}

// Run if executed directly
main().catch(console.error);

export { I18nChecker };
