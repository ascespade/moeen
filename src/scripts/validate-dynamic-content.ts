import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { logger } from '@/lib/logger';

/**
 * Validation script to check for hardcoded content violations
 * This ensures all content is dynamic and database-driven
 */

interface Violation {
  file: string;
  line: number;
  content: string;
  type: 'hardcoded_string' | 'static_array' | 'mock_data' | 'fallback_data';
  severity: 'error' | 'warning';
}

class DynamicContentValidator {
  private violations: Violation[] = [];
  private disallowedPatterns = [
    // Hardcoded strings in JSX/TSX (user-facing text)
    /<[^>]*>["'][^"']*["']<\/[^>]*>/g,
    /<[^>]*>["'][^"']*["']/g,
    // Static arrays in components (not utilities)
    /const\s+\w+\s*=\s*\[.*\]/g,
    /export\s+const\s+\w+\s*=\s*\[.*\]/g,
    // Mock data removed - using real database
async function main() {
  const validator = new DynamicContentValidator();

  logger.info('🔍 Starting dynamic content validation...');

  // Validate src directory
  await validator.validateDirectory('./src');

  // Generate report
  validator.generateReport();
}

// Run validation if this file is executed directly
if (require.main === module) {
  main().catch(logger.error);
}

export default DynamicContentValidator;
