/**
 * REAL Test Runner - NO SIMULATION, NO MOCK DATA
 * Runs actual Playwright/Jest tests and reports REAL results
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class RealTestRunner {
    constructor() {
        this.statusFile = path.join(process.cwd(), 'real-test-status.json');
        this.stats = {
            timestamp: new Date().toISOString(),
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            skippedTests: 0,
            duration: 0,
            testFiles: [],
            lastRun: null,
            isRunning: false
        };
        
        this.testDirectories = [
            'tests',
            'test',
            '__tests__',
            'e2e',
            'src/__tests__'
        ];
    }

    /**
     * Discover actual test files in the project
     */
    discoverTestFiles() {
        const testFiles = [];
        const projectRoot = process.cwd();

        console.log('🔍 Discovering REAL test files...');

        for (const dir of this.testDirectories) {
            const fullPath = path.join(projectRoot, dir);
            if (fs.existsSync(fullPath)) {
                const files = this.scanDirectory(fullPath);
                testFiles.push(...files);
            }
        }

        // Also check src directory
        const srcPath = path.join(projectRoot, 'src');
        if (fs.existsSync(srcPath)) {
            const files = this.scanDirectory(srcPath);
            testFiles.push(...files);
        }

        console.log(`✅ Found ${testFiles.length} REAL test files`);
        return testFiles;
    }

    scanDirectory(dir) {
        const files = [];
        const testPattern = /\.(test|spec)\.(js|jsx|ts|tsx)$/;

        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);

                if (this.shouldIgnore(entry.name)) continue;

                if (entry.isDirectory()) {
                    files.push(...this.scanDirectory(fullPath));
                } else if (testPattern.test(entry.name)) {
                    files.push(fullPath);
                }
            }
        } catch (error) {
            console.error(`Error scanning ${dir}:`, error.message);
        }

        return files;
    }

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
     * Run REAL Playwright tests
     */
    async runPlaywrightTests() {
        console.log('🎭 Running REAL Playwright tests...');

        return new Promise((resolve) => {
            try {
                // Check if Playwright is installed
                const playwrightPath = path.join(process.cwd(), 'node_modules', '.bin', 'playwright');
                
                if (!fs.existsSync(playwrightPath)) {
                    console.log('⚠️  Playwright not installed');
                    resolve({ success: false, reason: 'Playwright not installed' });
                    return;
                }

                // Run Playwright tests
                const result = execSync('npx playwright test --reporter=json', {
                    cwd: process.cwd(),
                    encoding: 'utf8',
                    timeout: 60000,
                    stdio: ['ignore', 'pipe', 'pipe']
                });

                const report = JSON.parse(result);
                resolve({ success: true, report });

            } catch (error) {
                // Even on test failures, parse the output
                if (error.stdout) {
                    try {
                        const report = JSON.parse(error.stdout);
                        resolve({ success: true, report });
                    } catch (e) {
                        console.error('Failed to parse Playwright output:', e.message);
                    }
                }
                resolve({ success: false, error: error.message });
            }
        });
    }

    /**
     * Run REAL Jest tests
     */
    async runJestTests() {
        console.log('🃏 Running REAL Jest tests...');

        return new Promise((resolve) => {
            try {
                const jestPath = path.join(process.cwd(), 'node_modules', '.bin', 'jest');
                
                if (!fs.existsSync(jestPath)) {
                    console.log('⚠️  Jest not installed');
                    resolve({ success: false, reason: 'Jest not installed' });
                    return;
                }

                const result = execSync('npx jest --json --coverage=false', {
                    cwd: process.cwd(),
                    encoding: 'utf8',
                    timeout: 60000,
                    stdio: ['ignore', 'pipe', 'pipe']
                });

                const report = JSON.parse(result);
                resolve({ success: true, report });

            } catch (error) {
                if (error.stdout) {
                    try {
                        const report = JSON.parse(error.stdout);
                        resolve({ success: true, report });
                    } catch (e) {
                        console.error('Failed to parse Jest output:', e.message);
                    }
                }
                resolve({ success: false, error: error.message });
            }
        });
    }

    /**
     * Get REAL test counts from actual test files
     */
    async getActualTestCounts() {
        const testFiles = this.discoverTestFiles();
        let totalTests = 0;
        const fileDetails = [];

        for (const file of testFiles) {
            try {
                const content = fs.readFileSync(file, 'utf8');
                
                // Count actual test cases
                const testMatches = content.match(/\b(test|it)\s*\(/g) || [];
                const describeMatches = content.match(/\bdescribe\s*\(/g) || [];
                
                const testCount = testMatches.length;
                totalTests += testCount;

                fileDetails.push({
                    path: file.replace(process.cwd(), ''),
                    testCount,
                    describeBlocks: describeMatches.length,
                    size: fs.statSync(file).size
                });

            } catch (error) {
                console.error(`Error reading ${file}:`, error.message);
            }
        }

        return {
            totalFiles: testFiles.length,
            totalTests,
            files: fileDetails
        };
    }

    /**
     * Run ALL available test frameworks
     */
    async runAllTests() {
        console.log('\n🚀 Starting REAL test execution...\n');
        
        this.stats.isRunning = true;
        this.stats.lastRun = new Date().toISOString();
        this.saveStatus();

        const startTime = Date.now();
        
        // Get actual test counts first
        const testCounts = await this.getActualTestCounts();
        console.log(`📊 Found ${testCounts.totalTests} REAL tests in ${testCounts.totalFiles} files`);

        this.stats.totalTests = testCounts.totalTests;
        this.stats.testFiles = testCounts.files;

        // Try running Playwright
        const playwrightResults = await this.runPlaywrightTests();
        if (playwrightResults.success && playwrightResults.report) {
            this.processPlaywrightResults(playwrightResults.report);
        }

        // Try running Jest
        const jestResults = await this.runJestTests();
        if (jestResults.success && jestResults.report) {
            this.processJestResults(jestResults.report);
        }

        // If no test framework available, just count from files
        if (!playwrightResults.success && !jestResults.success) {
            console.log('⚠️  No test framework available - showing file counts only');
            this.stats.passedTests = 0;
            this.stats.failedTests = 0;
            this.stats.skippedTests = 0;
        }

        this.stats.duration = Date.now() - startTime;
        this.stats.isRunning = false;
        this.stats.timestamp = new Date().toISOString();
        
        this.saveStatus();
        this.printSummary();

        return this.stats;
    }

    processPlaywrightResults(report) {
        // Process Playwright JSON report
        if (report.suites) {
            report.suites.forEach(suite => {
                suite.specs?.forEach(spec => {
                    spec.tests?.forEach(test => {
                        if (test.status === 'passed') {
                            this.stats.passedTests++;
                        } else if (test.status === 'failed') {
                            this.stats.failedTests++;
                        } else if (test.status === 'skipped') {
                            this.stats.skippedTests++;
                        }
                    });
                });
            });
        }
    }

    processJestResults(report) {
        // Process Jest JSON report
        if (report.numPassedTests !== undefined) {
            this.stats.passedTests += report.numPassedTests;
        }
        if (report.numFailedTests !== undefined) {
            this.stats.failedTests += report.numFailedTests;
        }
        if (report.numPendingTests !== undefined) {
            this.stats.skippedTests += report.numPendingTests;
        }
        if (report.numTotalTests !== undefined) {
            this.stats.totalTests = Math.max(this.stats.totalTests, report.numTotalTests);
        }
    }

    saveStatus() {
        fs.writeFileSync(this.statusFile, JSON.stringify(this.stats, null, 2));
    }

    printSummary() {
        console.log('\n' + '═'.repeat(70));
        console.log('📊 REAL TEST RESULTS (NO SIMULATION)');
        console.log('═'.repeat(70));
        console.log(`Total Tests:   ${this.stats.totalTests}`);
        console.log(`Passed:        ${this.stats.passedTests} ✅`);
        console.log(`Failed:        ${this.stats.failedTests} ❌`);
        console.log(`Skipped:       ${this.stats.skippedTests} ⏭️`);
        console.log(`Duration:      ${(this.stats.duration / 1000).toFixed(2)}s`);
        console.log(`Test Files:    ${this.stats.testFiles.length}`);
        console.log('═'.repeat(70) + '\n');
    }
}

// Run if called directly
if (require.main === module) {
    const runner = new RealTestRunner();
    
    async function runContinuously() {
        while (true) {
            await runner.runAllTests();
            console.log('⏳ Waiting 30 seconds before next run...\n');
            await new Promise(resolve => setTimeout(resolve, 30000));
        }
    }

    runContinuously().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = RealTestRunner;


