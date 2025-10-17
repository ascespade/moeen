/**
 * Test Discovery API
 * Scans the file system for actual test files and their contents
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class TestDiscovery {
    constructor() {
        this.testDirectories = [
            'tests',
            'test',
            '__tests__',
            'e2e',
            'spec',
            'src/__tests__',
            'src/tests'
        ];
        
        this.testFilePatterns = [
            /\.test\.(js|jsx|ts|tsx)$/,
            /\.spec\.(js|jsx|ts|tsx)$/,
            /\.e2e\.(js|jsx|ts|tsx)$/,
            /_test\.(js|jsx|ts|tsx)$/
        ];
    }

    /**
     * Discover all test files in the project
     */
    async discoverTests() {
        const testFiles = [];
        const projectRoot = process.cwd();
        
        console.log('🔍 Starting test discovery in:', projectRoot);

        // Scan each test directory
        for (const dir of this.testDirectories) {
            const fullPath = path.join(projectRoot, dir);
            
            if (fs.existsSync(fullPath)) {
                console.log(`📁 Scanning: ${dir}`);
                const files = this.scanDirectory(fullPath);
                testFiles.push(...files);
            }
        }

        // Also scan src directory for inline tests
        const srcPath = path.join(projectRoot, 'src');
        if (fs.existsSync(srcPath)) {
            console.log('📁 Scanning: src');
            const files = this.scanDirectory(srcPath);
            testFiles.push(...files);
        }

        // Analyze each test file
        const analyzedFiles = testFiles.map(file => this.analyzeTestFile(file));

        return {
            totalFiles: analyzedFiles.length,
            testFiles: analyzedFiles,
            summary: this.generateSummary(analyzedFiles)
        };
    }

    /**
     * Recursively scan directory for test files
     */
    scanDirectory(dir) {
        const files = [];
        
        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                
                // Skip node_modules and other common ignore patterns
                if (this.shouldIgnore(entry.name)) {
                    continue;
                }
                
                if (entry.isDirectory()) {
                    files.push(...this.scanDirectory(fullPath));
                } else if (entry.isFile() && this.isTestFile(entry.name)) {
                    files.push(fullPath);
                }
            }
        } catch (error) {
            console.error(`Error scanning ${dir}:`, error.message);
        }
        
        return files;
    }

    /**
     * Check if filename matches test file patterns
     */
    isTestFile(filename) {
        return this.testFilePatterns.some(pattern => pattern.test(filename));
    }

    /**
     * Check if path should be ignored
     */
    shouldIgnore(name) {
        const ignorePatterns = [
            'node_modules',
            '.git',
            '.next',
            'dist',
            'build',
            'coverage',
            '.cache'
        ];
        
        return ignorePatterns.includes(name);
    }

    /**
     * Analyze a test file to extract metadata
     */
    analyzeTestFile(filePath) {
        try {
            const stats = fs.statSync(filePath);
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Extract test information
            const tests = this.extractTests(content);
            const describes = this.extractDescribes(content);
            const imports = this.extractImports(content);
            
            return {
                path: filePath.replace(process.cwd(), ''),
                absolutePath: filePath,
                size: stats.size,
                modified: stats.mtime,
                created: stats.birthtime,
                testCount: tests.length,
                describeBlocks: describes.length,
                imports: imports,
                tests: tests,
                framework: this.detectFramework(content)
            };
        } catch (error) {
            console.error(`Error analyzing ${filePath}:`, error.message);
            return {
                path: filePath,
                error: error.message
            };
        }
    }

    /**
     * Extract test cases from file content
     */
    extractTests(content) {
        const tests = [];
        
        // Match: test('...', ...), it('...', ...)
        const testRegex = /(test|it)\s*\(\s*['"`]([^'"`]+)['"`]/g;
        let match;
        
        while ((match = testRegex.exec(content)) !== null) {
            tests.push({
                name: match[2],
                type: match[1],
                line: content.substring(0, match.index).split('\n').length
            });
        }
        
        return tests;
    }

    /**
     * Extract describe blocks from file content
     */
    extractDescribes(content) {
        const describes = [];
        const describeRegex = /describe\s*\(\s*['"`]([^'"`]+)['"`]/g;
        let match;
        
        while ((match = describeRegex.exec(content)) !== null) {
            describes.push({
                name: match[1],
                line: content.substring(0, match.index).split('\n').length
            });
        }
        
        return describes;
    }

    /**
     * Extract imports from file
     */
    extractImports(content) {
        const imports = [];
        const importRegex = /import\s+.*?from\s+['"`]([^'"`]+)['"`]/g;
        let match;
        
        while ((match = importRegex.exec(content)) !== null) {
            imports.push(match[1]);
        }
        
        return imports;
    }

    /**
     * Detect testing framework being used
     */
    detectFramework(content) {
        if (content.includes('from \'@playwright/test\'') || content.includes('from "@playwright/test"')) {
            return 'Playwright';
        }
        if (content.includes('from \'vitest\'') || content.includes('from "vitest"')) {
            return 'Vitest';
        }
        if (content.includes('from \'jest\'') || content.includes('from "jest"')) {
            return 'Jest';
        }
        if (content.includes('from \'mocha\'') || content.includes('from "mocha"')) {
            return 'Mocha';
        }
        if (content.includes('from \'supertest\'') || content.includes('from "supertest"')) {
            return 'Supertest';
        }
        return 'Unknown';
    }

    /**
     * Generate summary statistics
     */
    generateSummary(files) {
        const frameworks = {};
        let totalTests = 0;
        let totalSize = 0;
        
        files.forEach(file => {
            if (!file.error) {
                totalTests += file.testCount || 0;
                totalSize += file.size || 0;
                
                const fw = file.framework || 'Unknown';
                frameworks[fw] = (frameworks[fw] || 0) + 1;
            }
        });
        
        return {
            totalTests,
            totalSize,
            frameworks,
            averageTestsPerFile: files.length > 0 ? (totalTests / files.length).toFixed(2) : 0
        };
    }

    /**
     * Get test execution status from actual test runners
     */
    async getTestExecutionStatus() {
        const status = {
            playwright: await this.checkPlaywrightStatus(),
            jest: await this.checkJestStatus(),
            npm: await this.checkNpmTestStatus()
        };
        
        return status;
    }

    /**
     * Check Playwright test status
     */
    async checkPlaywrightStatus() {
        try {
            // Check if Playwright is installed
            const hasPlaywright = fs.existsSync(path.join(process.cwd(), 'node_modules', '@playwright'));
            
            if (!hasPlaywright) {
                return { installed: false };
            }
            
            // Try to get last test results
            const reportPath = path.join(process.cwd(), 'playwright-report');
            const hasReport = fs.existsSync(reportPath);
            
            return {
                installed: true,
                hasReport,
                reportPath: hasReport ? reportPath : null
            };
        } catch (error) {
            return { error: error.message };
        }
    }

    /**
     * Check Jest test status
     */
    async checkJestStatus() {
        try {
            const hasJest = fs.existsSync(path.join(process.cwd(), 'node_modules', 'jest'));
            
            if (!hasJest) {
                return { installed: false };
            }
            
            const coveragePath = path.join(process.cwd(), 'coverage');
            const hasCoverage = fs.existsSync(coveragePath);
            
            return {
                installed: true,
                hasCoverage,
                coveragePath: hasCoverage ? coveragePath : null
            };
        } catch (error) {
            return { error: error.message };
        }
    }

    /**
     * Check npm test scripts
     */
    async checkNpmTestStatus() {
        try {
            const packageJsonPath = path.join(process.cwd(), 'package.json');
            
            if (!fs.existsSync(packageJsonPath)) {
                return { hasPackageJson: false };
            }
            
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            const scripts = packageJson.scripts || {};
            
            const testScripts = Object.keys(scripts).filter(key => 
                key.includes('test') || key.includes('e2e')
            );
            
            return {
                hasPackageJson: true,
                testScripts,
                scripts: testScripts.reduce((obj, key) => {
                    obj[key] = scripts[key];
                    return obj;
                }, {})
            };
        } catch (error) {
            return { error: error.message };
        }
    }
}

module.exports = TestDiscovery;


