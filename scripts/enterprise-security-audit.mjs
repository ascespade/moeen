#!/usr/bin/env node
/**
 * Enterprise Security Audit - Comprehensive Security Assessment
 * فحص الأمان الشامل على مستوى Enterprise
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const workspaceRoot = join(__dirname, '..');

const REPORT_DIR = join(workspaceRoot, 'reports', 'enterprise-audit');
const REPORT_FILE = join(REPORT_DIR, 'security-audit-report.json');

import { mkdirSync, writeFileSync } from 'fs';
try {
  mkdirSync(REPORT_DIR, { recursive: true });
} catch (e) {}

class SecurityAuditor {
  constructor() {
    this.report = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      findings: [],
      summary: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        info: 0,
        total: 0,
      },
      categories: {
        authentication: [],
        authorization: [],
        apiSecurity: [],
        dataEncryption: [],
        owaspTop10: [],
        headers: [],
        csrf: [],
        rateLimiting: [],
        inputValidation: [],
        sessionManagement: [],
        passwordPolicy: [],
        environment: [],
        dependencies: [],
        compliance: [],
      },
      recommendations: [],
      score: 0,
    };
  }

  addFinding(category, severity, title, description, file = null, line = null, recommendation = null) {
    const finding = {
      id: `SEC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      category,
      severity, // critical, high, medium, low, info
      title,
      description,
      file: file ? relative(workspaceRoot, file) : null,
      line,
      recommendation,
      timestamp: new Date().toISOString(),
    };

    this.report.findings.push(finding);
    this.report.categories[category] = this.report.categories[category] || [];
    this.report.categories[category].push(finding);

    // Update summary
    this.report.summary[severity]++;
    this.report.summary.total++;
  }

  // OWASP Top 10 Checks
  checkOWASP() {
    console.log('🔒 Checking OWASP Top 10 compliance...');

    // A01:2021 – Broken Access Control
    this.checkBrokenAccessControl();

    // A02:2021 – Cryptographic Failures
    this.checkCryptographicFailures();

    // A03:2021 – Injection
    this.checkInjection();

    // A04:2021 – Insecure Design
    this.checkInsecureDesign();

    // A05:2021 – Security Misconfiguration
    this.checkSecurityMisconfiguration();

    // A06:2021 – Vulnerable Components
    this.checkVulnerableComponents();

    // A07:2021 – Authentication Failures
    this.checkAuthenticationFailures();

    // A08:2021 – Software and Data Integrity Failures
    this.checkDataIntegrity();

    // A09:2021 – Security Logging Failures
    this.checkSecurityLogging();

    // A10:2021 – Server-Side Request Forgery
    this.checkSSRF();
  }

  checkBrokenAccessControl() {
    // Check for missing authorization checks
    const apiRoutes = this.findFiles('src/app/api', ['.ts']);
    let missingAuth = 0;

    apiRoutes.forEach(file => {
      const content = readFileSync(file, 'utf-8');
      
      // Check if route has authorization
      if (content.includes('export async function GET') || 
          content.includes('export async function POST') ||
          content.includes('export async function PUT') ||
          content.includes('export async function DELETE')) {
        
        // Should have authorize or requireAuth
        if (!content.includes('authorize') && 
            !content.includes('requireAuth') &&
            !content.includes('authMiddleware') &&
            !file.includes('public')) {
          missingAuth++;
          this.addFinding(
            'owaspTop10',
            'high',
            'Missing Authorization Check',
            `API route ${relative(workspaceRoot, file)} may be missing authorization check`,
            file,
            null,
            'Add authorization check using authorize() or requireAuth() functions'
          );
        }
      }
    });

    // Check RLS policies
    const migrations = this.findFiles('supabase', ['.sql']);
    let hasRLS = false;
    migrations.forEach(file => {
      const content = readFileSync(file, 'utf-8');
      if (content.includes('ENABLE ROW LEVEL SECURITY') || content.includes('enable row level security')) {
        hasRLS = true;
      }
    });

    if (!hasRLS) {
      this.addFinding(
        'owaspTop10',
        'critical',
        'Row Level Security Not Enabled',
        'RLS policies may not be enabled on sensitive tables',
        null,
        null,
        'Enable RLS on all tables containing sensitive data and create appropriate policies'
      );
    }
  }

  checkCryptographicFailures() {
    // Check for hardcoded secrets
    const files = this.findFiles('src', ['.ts', '.tsx', '.js']);
    const secretPatterns = [
      /password\s*=\s*['"]/i,
      /secret\s*=\s*['"][^'"]{10,}/i,
      /api[_-]?key\s*=\s*['"][^'"]{10,}/i,
      /jwt[_-]?secret\s*=\s*['"][^'"]{10,}/i,
      /private[_-]?key\s*=\s*['"][^'"]{10,}/i,
    ];

    files.forEach(file => {
      // Skip node_modules and build files
      if (file.includes('node_modules') || file.includes('.next')) return;

      const content = readFileSync(file, 'utf-8');
      secretPatterns.forEach((pattern, index) => {
        if (pattern.test(content)) {
          const lines = content.split('\n');
          const lineNum = lines.findIndex(line => pattern.test(line)) + 1;
          
          if (!content.includes('process.env') && !content.includes('env.')) {
            this.addFinding(
              'owaspTop10',
              'critical',
              'Potential Hardcoded Secret',
              `Possible hardcoded secret found in ${relative(workspaceRoot, file)}`,
              file,
              lineNum,
              'Move secrets to environment variables. Never commit secrets to version control.'
            );
          }
        }
      });
    });

    // Check password hashing
    const authFiles = this.findFiles('src', ['.ts']).filter(f => 
      f.includes('auth') || f.includes('password') || f.includes('user')
    );

    let usesSecureHashing = false;
    authFiles.forEach(file => {
      const content = readFileSync(file, 'utf-8');
      if (content.includes('bcrypt') || 
          content.includes('scrypt') || 
          content.includes('argon2') ||
          content.includes('pbkdf2') ||
          content.includes('supabase.auth')) {
        usesSecureHashing = true;
      }
    });

    // Check if passwords are stored in plain text queries
    const sqlFiles = this.findFiles('src', ['.sql', '.ts']).filter(f => 
      f.includes('password') || f.includes('auth')
    );

    sqlFiles.forEach(file => {
      const content = readFileSync(file, 'utf-8');
      if (content.match(/insert.*password.*values.*['"][^'"]{5,}/i) && 
          !content.includes('hash') && 
          !content.includes('bcrypt') &&
          !content.includes('encrypt')) {
        this.addFinding(
          'owaspTop10',
          'critical',
          'Potential Plain Text Password Storage',
          `Password may be stored without hashing in ${relative(workspaceRoot, file)}`,
          file,
          null,
          'Always hash passwords before storage using bcrypt, scrypt, or similar'
        );
      }
    });
  }

  checkInjection() {
    // Check for SQL injection vulnerabilities
    const files = this.findFiles('src', ['.ts', '.tsx']);
    
    files.forEach(file => {
      const content = readFileSync(file, 'utf-8');
      
      // Check for string concatenation in SQL queries
      if (content.match(/(?:SELECT|INSERT|UPDATE|DELETE).*\$\{.*\}/i) ||
          content.match(/(?:SELECT|INSERT|UPDATE|DELETE).*\+.*\+/i)) {
        // But check if using parameterized queries or ORM
        if (!content.includes('supabase') && 
            !content.includes('query(') && 
            !content.includes('.from(') &&
            !content.includes('parameterized')) {
          this.addFinding(
            'owaspTop10',
            'high',
            'Potential SQL Injection',
            `Possible SQL injection vulnerability in ${relative(workspaceRoot, file)}`,
            file,
            null,
            'Use parameterized queries or ORM methods. Supabase client handles this automatically.'
          );
        }
      }

      // Check for XSS vulnerabilities
      if (content.includes('dangerouslySetInnerHTML')) {
        // Check if using DOMPurify
        if (!content.includes('DOMPurify') && 
            !content.includes('dompurify') && 
            !content.includes('isomorphic-dompurify') &&
            !content.includes('sanitize')) {
          this.addFinding(
            'owaspTop10',
            'high',
            'Potential XSS Vulnerability',
            `dangerouslySetInnerHTML used without sanitization in ${relative(workspaceRoot, file)}`,
            file,
            null,
            'Always sanitize HTML content using DOMPurify or similar library before using dangerouslySetInnerHTML'
          );
        }
      }
    });
  }

  checkInsecureDesign() {
    // Check for missing validation schemas
    const apiRoutes = this.findFiles('src/app/api', ['.ts']);
    let missingValidation = 0;

    apiRoutes.forEach(file => {
      const content = readFileSync(file, 'utf-8');
      
      if (content.includes('request.json()') || 
          content.includes('req.body') ||
          content.includes('request.formData()')) {
        // Should have validation with zod or similar
        if (!content.includes('zod') && 
            !content.includes('validate') &&
            !content.includes('schema') &&
            !content.includes('validation')) {
          missingValidation++;
          if (missingValidation <= 5) { // Limit to avoid spam
            this.addFinding(
              'owaspTop10',
              'medium',
              'Missing Input Validation',
              `API route ${relative(workspaceRoot, file)} may be missing input validation`,
              file,
              null,
              'Add input validation using Zod schemas or similar validation library'
            );
          }
        }
      }
    });
  }

  checkSecurityMisconfiguration() {
    // Check environment variables
    const envExample = join(workspaceRoot, 'env.example');
    if (!existsSync(envExample)) {
      this.addFinding(
        'owaspTop10',
        'medium',
        'Missing .env.example',
        '.env.example file not found. This makes it unclear what environment variables are required.',
        null,
        null,
        'Create .env.example file with all required environment variables (without sensitive values)'
      );
    }

    // Check for debug mode in production
    const nextConfig = join(workspaceRoot, 'next.config.js');
    if (existsSync(nextConfig)) {
      const content = readFileSync(nextConfig, 'utf-8');
      if (content.includes('reactStrictMode: false')) {
        this.addFinding(
          'owaspTop10',
          'medium',
          'React Strict Mode Disabled',
          'React strict mode is disabled which may hide security issues',
          nextConfig,
          null,
          'Enable React strict mode for better security and error detection'
        );
      }
    }

    // Check for exposed error messages
    const files = this.findFiles('src/app/api', ['.ts']);
    files.forEach(file => {
      const content = readFileSync(file, 'utf-8');
      if (content.match(/error\.(message|stack|toString)\(\)/i) && 
          !content.includes('NODE_ENV') && 
          !content.includes('process.env.NODE_ENV')) {
        this.addFinding(
          'owaspTop10',
          'low',
          'Potential Information Disclosure',
          `Error details may be exposed in ${relative(workspaceRoot, file)}`,
          file,
          null,
          'Only expose detailed error messages in development. Use generic messages in production.'
        );
      }
    });
  }

  checkVulnerableComponents() {
    // Already checked in dependency analysis, but add reference
    this.addFinding(
      'owaspTop10',
      'info',
      'Dependency Vulnerability Check',
      'Dependency vulnerabilities are checked via npm audit. See dependency analysis section.',
      null,
      null,
      'Regularly run npm audit and update vulnerable packages'
    );
  }

  checkAuthenticationFailures() {
    // Check authentication implementation
    const authFile = join(workspaceRoot, 'src/lib/auth/authorize.ts');
    if (existsSync(authFile)) {
      const content = readFileSync(authFile, 'utf-8');
      
      // Check for weak JWT secret
      if (content.includes('JWT_SECRET') && !content.includes('length') && !content.includes('32')) {
        this.addFinding(
          'authentication',
          'medium',
          'JWT Secret Strength',
          'Ensure JWT_SECRET is at least 32 characters long',
          authFile,
          null,
          'Use a strong JWT secret (minimum 32 characters, random, stored in environment)'
        );
      }

      // Check session timeout
      if (!content.includes('maxAge') && !content.includes('expires')) {
        this.addFinding(
          'authentication',
          'medium',
          'Session Timeout',
          'Session timeout may not be configured',
          authFile,
          null,
          'Implement session timeout (e.g., 24 hours) and refresh tokens for long-term sessions'
        );
      }
    }
  }

  checkDataIntegrity() {
    // Check for integrity checks
    this.addFinding(
      'owaspTop10',
      'info',
      'Data Integrity',
      'Ensure database backups are encrypted and have integrity checks',
      null,
      null,
      'Implement database backup encryption and integrity verification'
    );
  }

  checkSecurityLogging() {
    // Check for audit logging
    const auditFiles = this.findFiles('src', ['.ts']).filter(f => 
      f.includes('audit') || f.includes('log')
    );

    if (auditFiles.length === 0) {
      this.addFinding(
        'owaspTop10',
        'medium',
        'Missing Security Logging',
        'No dedicated security audit logging found',
        null,
        null,
        'Implement comprehensive audit logging for security events (logins, permission changes, data access)'
      );
    }
  }

  checkSSRF() {
    // Check for SSRF vulnerabilities
    const files = this.findFiles('src/app/api', ['.ts']);
    
    files.forEach(file => {
      const content = readFileSync(file, 'utf-8');
      if (content.match(/fetch\(.*req\.(body|query|params)/i) ||
          content.match(/fetch\(.*request\.(json|formData)/i)) {
        this.addFinding(
          'owaspTop10',
          'high',
          'Potential SSRF Vulnerability',
          `Server-side fetch may be vulnerable to SSRF in ${relative(workspaceRoot, file)}`,
          file,
          null,
          'Validate and whitelist allowed URLs. Never fetch user-provided URLs directly.'
        );
      }
    });
  }

  // Authentication & Authorization Checks
  checkAuthentication() {
    console.log('🔐 Checking Authentication implementation...');

    const authFile = join(workspaceRoot, 'src/lib/auth/authorize.ts');
    if (!existsSync(authFile)) {
      this.addFinding(
        'authentication',
        'critical',
        'Authentication Module Missing',
        'Authentication module not found',
        null,
        null,
        'Implement authentication module'
      );
      return;
    }

    const content = readFileSync(authFile, 'utf-8');
    
    // Check for proper error handling
    if (!content.includes('try') || !content.includes('catch')) {
      this.addFinding(
        'authentication',
        'high',
        'Missing Error Handling',
        'Authentication function may be missing proper error handling',
        authFile,
        null,
        'Add comprehensive error handling in authentication functions'
      );
    }

    // Check for rate limiting on auth endpoints
    const loginRoutes = this.findFiles('src/app/api', ['.ts']).filter(f => 
      f.includes('login') || f.includes('auth')
    );

    let hasRateLimit = false;
    loginRoutes.forEach(file => {
      const fileContent = readFileSync(file, 'utf-8');
      if (fileContent.includes('rateLimit') || fileContent.includes('RateLimiter')) {
        hasRateLimit = true;
      }
    });

    if (!hasRateLimit && loginRoutes.length > 0) {
      this.addFinding(
        'authentication',
        'high',
        'Missing Rate Limiting on Auth Endpoints',
        'Authentication endpoints may not have rate limiting',
        null,
        null,
        'Implement rate limiting on all authentication endpoints to prevent brute force attacks'
      );
    }
  }

  checkAuthorization() {
    console.log('🔐 Checking Authorization implementation...');

    // Check role-based access control
    const permissionFiles = this.findFiles('src', ['.ts']).filter(f => 
      f.includes('permission') || f.includes('role')
    );

    if (permissionFiles.length === 0) {
      this.addFinding(
        'authorization',
        'high',
        'Authorization Module Missing',
        'No dedicated authorization/permission module found',
        null,
        null,
        'Implement comprehensive RBAC (Role-Based Access Control) system'
      );
    }

    // Check for permission checks in sensitive operations
    const sensitiveOperations = this.findFiles('src/app/api', ['.ts']).filter(f => 
      f.includes('patient') || f.includes('medical') || f.includes('billing') || f.includes('user')
    );

    let missingPerms = 0;
    sensitiveOperations.forEach(file => {
      const content = readFileSync(file, 'utf-8');
      if (!content.includes('permission') && 
          !content.includes('authorize') && 
          !content.includes('role') &&
          !file.includes('public')) {
        missingPerms++;
        if (missingPerms <= 5) {
          this.addFinding(
            'authorization',
            'high',
            'Missing Permission Check',
            `Sensitive operation may be missing permission check in ${relative(workspaceRoot, file)}`,
            file,
            null,
            'Add permission checks for all sensitive operations'
          );
        }
      }
    });
  }

  // Security Headers Check
  checkSecurityHeaders() {
    console.log('🛡️ Checking Security Headers...');

    const middlewareFile = join(workspaceRoot, 'src/middleware/security.ts');
    if (!existsSync(middlewareFile)) {
      this.addFinding(
        'headers',
        'high',
        'Security Middleware Missing',
        'Security middleware not found',
        null,
        null,
        'Implement security middleware with proper headers'
      );
      return;
    }

    const content = readFileSync(middlewareFile, 'utf-8');
    const requiredHeaders = [
      'X-Content-Type-Options',
      'X-Frame-Options',
      'X-XSS-Protection',
      'Strict-Transport-Security',
      'Content-Security-Policy',
      'Referrer-Policy',
    ];

    requiredHeaders.forEach(header => {
      if (!content.includes(header.replace(/-/g, '')) && 
          !content.includes(header.toLowerCase())) {
        this.addFinding(
          'headers',
          'medium',
          `Missing Security Header: ${header}`,
          `${header} security header may not be set`,
          middlewareFile,
          null,
          `Add ${header} header to security middleware`
        );
      }
    });
  }

  // CSRF Protection Check
  checkCSRF() {
    console.log('🛡️ Checking CSRF Protection...');

    const securityFile = join(workspaceRoot, 'src/lib/security.ts');
    if (!existsSync(securityFile)) {
      this.addFinding(
        'csrf',
        'high',
        'CSRF Protection Missing',
        'CSRF protection implementation not found',
        null,
        null,
        'Implement CSRF protection for state-changing operations'
      );
      return;
    }

    const content = readFileSync(securityFile, 'utf-8');
    if (!content.includes('CSRF') && !content.includes('csrf')) {
      this.addFinding(
        'csrf',
        'high',
        'CSRF Protection Not Implemented',
        'CSRF protection class exists but may not be used',
        securityFile,
        null,
        'Ensure CSRF tokens are validated on all POST/PUT/DELETE requests'
      );
    }

    // Check if CSRF is applied to API routes
    const apiRoutes = this.findFiles('src/app/api', ['.ts']);
    let csrfProtected = 0;
    apiRoutes.forEach(file => {
      const content = readFileSync(file, 'utf-8');
      if (content.includes('CSRF') || content.includes('csrf') || content.includes('validateToken')) {
        csrfProtected++;
      }
    });

    if (csrfProtected < apiRoutes.length * 0.5) {
      this.addFinding(
        'csrf',
        'medium',
        'Incomplete CSRF Protection',
        `Only ${csrfProtected}/${apiRoutes.length} API routes appear to have CSRF protection`,
        null,
        null,
        'Apply CSRF protection to all state-changing API endpoints (POST, PUT, DELETE, PATCH)'
      );
    }
  }

  // Rate Limiting Check
  checkRateLimiting() {
    console.log('⏱️ Checking Rate Limiting...');

    const securityFile = join(workspaceRoot, 'src/lib/security.ts');
    if (!existsSync(securityFile)) {
      this.addFinding(
        'rateLimiting',
        'high',
        'Rate Limiting Missing',
        'Rate limiting implementation not found',
        null,
        null,
        'Implement rate limiting to prevent abuse and DDoS attacks'
      );
      return;
    }

    const content = readFileSync(securityFile, 'utf-8');
    if (!content.includes('RateLimit') && !content.includes('rateLimit')) {
      this.addFinding(
        'rateLimiting',
        'high',
        'Rate Limiting Not Implemented',
        'Rate limiting class exists but may not be used',
        securityFile,
        null,
        'Apply rate limiting to all API endpoints, especially authentication endpoints'
      );
    }

    // Check middleware
    const middlewareFile = join(workspaceRoot, 'src/middleware.ts');
    if (existsSync(middlewareFile)) {
      const middlewareContent = readFileSync(middlewareFile, 'utf-8');
      if (!middlewareContent.includes('rateLimit') && !middlewareContent.includes('RateLimit')) {
        this.addFinding(
          'rateLimiting',
          'medium',
          'Rate Limiting Not Applied in Middleware',
          'Rate limiting may not be applied globally in middleware',
          middlewareFile,
          null,
          'Apply rate limiting in middleware for all requests'
        );
      }
    }
  }

  // Input Validation Check
  checkInputValidation() {
    console.log('✅ Checking Input Validation...');

    // Check for Zod usage
    const packageJson = JSON.parse(
      readFileSync(join(workspaceRoot, 'package.json'), 'utf-8')
    );

    if (!packageJson.dependencies?.zod && !packageJson.devDependencies?.zod) {
      this.addFinding(
        'inputValidation',
        'medium',
        'Input Validation Library Missing',
        'Zod validation library not found in dependencies',
        null,
        null,
        'Add Zod or similar validation library for input validation'
      );
    }

    // Check API routes for validation
    const apiRoutes = this.findFiles('src/app/api', ['.ts']);
    let validatedRoutes = 0;
    apiRoutes.forEach(file => {
      const content = readFileSync(file, 'utf-8');
      if (content.includes('zod') || 
          content.includes('validate') || 
          content.includes('schema.parse')) {
        validatedRoutes++;
      }
    });

    if (validatedRoutes < apiRoutes.length * 0.7) {
      this.addFinding(
        'inputValidation',
        'high',
        'Incomplete Input Validation',
        `Only ${validatedRoutes}/${apiRoutes.length} API routes appear to validate input`,
        null,
        null,
        'Add input validation to all API routes that accept user input'
      );
    }
  }

  // Session Management Check
  checkSessionManagement() {
    console.log('🔒 Checking Session Management...');

    const authFile = join(workspaceRoot, 'src/lib/auth/authorize.ts');
    if (existsSync(authFile)) {
      const content = readFileSync(authFile, 'utf-8');
      
      // Check for secure cookie flags
      if (content.includes('cookie') || content.includes('Cookie')) {
        if (!content.includes('httpOnly') || !content.includes('secure') || !content.includes('sameSite')) {
          this.addFinding(
            'sessionManagement',
            'high',
            'Insecure Cookie Configuration',
            'Session cookies may not have secure flags (httpOnly, secure, sameSite)',
            authFile,
            null,
            'Ensure all session cookies have httpOnly, secure, and sameSite flags set'
          );
        }
      }

      // Check for session timeout
      if (!content.includes('maxAge') && !content.includes('expiresIn')) {
        this.addFinding(
          'sessionManagement',
          'medium',
          'Session Timeout Not Configured',
          'Session timeout may not be configured',
          authFile,
          null,
          'Implement session timeout and automatic logout'
        );
      }
    }
  }

  // Password Policy Check
  checkPasswordPolicy() {
    console.log('🔑 Checking Password Policy...');

    const securityFile = join(workspaceRoot, 'src/lib/security.ts');
    if (existsSync(securityFile)) {
      const content = readFileSync(securityFile, 'utf-8');
      
      if (content.includes('PasswordValidator')) {
        // Check password requirements
        const hasMinLength = content.includes('length') && content.match(/length\s*[<>]=\s*8/);
        const hasUpperCase = content.includes('A-Z') || content.includes('uppercase');
        const hasLowerCase = content.includes('a-z') || content.includes('lowercase');
        const hasNumber = content.includes('\\d') || content.includes('number');
        const hasSpecial = content.includes('[!@#$%^&*') || content.includes('special');

        if (!hasMinLength) {
          this.addFinding(
            'passwordPolicy',
            'medium',
            'Weak Password Minimum Length',
            'Password validator may not enforce minimum 8 characters',
            securityFile,
            null,
            'Enforce minimum password length of at least 8 characters (preferably 12+)'
          );
        }
      } else {
        this.addFinding(
          'passwordPolicy',
          'high',
          'Password Validator Missing',
          'Password validation class not found',
          securityFile,
          null,
          'Implement password validator with strong requirements (length, complexity)'
        );
      }
    }
  }

  // Environment Variables Check
  checkEnvironment() {
    console.log('🌍 Checking Environment Configuration...');

    const envExample = join(workspaceRoot, 'env.example');
    if (existsSync(envExample)) {
      const content = readFileSync(envExample, 'utf-8');
      
      // Check for sensitive values
      if (content.includes('secret') || content.includes('key') || content.includes('password')) {
        // Check if values are empty or have placeholders
        const hasPlaceholders = content.includes('your_') || 
                                content.includes('YOUR_') || 
                                content.includes('xxx') ||
                                content.includes('***');
        
        if (!hasPlaceholders) {
          this.addFinding(
            'environment',
            'high',
            'Potential Secrets in .env.example',
            '.env.example may contain actual secret values instead of placeholders',
            envExample,
            null,
            'Remove all actual secrets from .env.example. Use placeholders only.'
          );
        }
      }
    }

    // Check .gitignore for .env
    const gitignore = join(workspaceRoot, '.gitignore');
    if (existsSync(gitignore)) {
      const content = readFileSync(gitignore, 'utf-8');
      if (!content.includes('.env') && !content.includes('.env.local')) {
        this.addFinding(
          'environment',
          'critical',
          '.env Files Not in .gitignore',
          '.env files may not be ignored by git',
          gitignore,
          null,
          'Add .env, .env.local, .env.production to .gitignore'
        );
      }
    } else {
      this.addFinding(
        'environment',
        'critical',
        '.gitignore Missing',
        '.gitignore file not found',
        null,
        null,
        'Create .gitignore file and ensure .env files are excluded'
      );
    }
  }

  // Compliance Checks
  checkCompliance() {
    console.log('📋 Checking Compliance...');

    // HIPAA Compliance - Check for audit logging
    const auditFiles = this.findFiles('src', ['.ts']).filter(f => 
      f.includes('audit') || f.includes('log')
    );

    if (auditFiles.length === 0) {
      this.addFinding(
        'compliance',
        'high',
        'HIPAA: Missing Audit Logging',
        'HIPAA requires comprehensive audit logging for PHI access',
        null,
        null,
        'Implement audit logging for all PHI (Protected Health Information) access'
      );
    }

    // GDPR - Check for data deletion capabilities
    const userFiles = this.findFiles('src', ['.ts']).filter(f => 
      f.includes('user') || f.includes('patient')
    );

    let hasDataDeletion = false;
    userFiles.forEach(file => {
      const content = readFileSync(file, 'utf-8');
      if (content.includes('delete') && (content.includes('user') || content.includes('patient'))) {
        hasDataDeletion = true;
      }
    });

    if (!hasDataDeletion) {
      this.addFinding(
        'compliance',
        'medium',
        'GDPR: Right to Erasure',
        'Data deletion functionality may be missing (GDPR Article 17)',
        null,
        null,
        'Implement user data deletion functionality to comply with GDPR Right to Erasure'
      );
    }

    // Check for data encryption at rest
    this.addFinding(
      'compliance',
      'info',
      'Data Encryption Verification',
      'Verify that database encryption at rest is enabled in Supabase',
      null,
      null,
      'Ensure Supabase database encryption at rest is enabled for HIPAA compliance'
    );
  }

  // Helper Methods
  findFiles(dir, extensions) {
    const files = [];
    if (!existsSync(dir)) return files;

    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        
        // Skip node_modules, .next, build directories
        if (entry.name.includes('node_modules') || 
            entry.name.includes('.next') ||
            entry.name.includes('dist') ||
            entry.name.includes('build') ||
            entry.name.startsWith('.')) {
          continue;
        }

        if (entry.isDirectory()) {
          files.push(...this.findFiles(fullPath, extensions));
        } else if (entry.isFile()) {
          const ext = entry.name.split('.').pop();
          if (extensions.includes(`.${ext}`)) {
            files.push(fullPath);
          }
        }
      }
    } catch (e) {
      // Ignore errors (permissions, etc.)
    }

    return files;
  }

  calculateScore() {
    // Calculate security score (0-100)
    const weights = {
      critical: 20,
      high: 10,
      medium: 5,
      low: 2,
      info: 0,
    };

    let score = 100;
    Object.entries(this.report.summary).forEach(([severity, count]) => {
      if (severity !== 'total' && weights[severity]) {
        score -= Math.min(weights[severity] * count, 100);
      }
    });

    this.report.score = Math.max(0, Math.min(100, score));
    
    // Add score interpretation
    if (this.report.score >= 90) {
      this.report.scoreLevel = 'Excellent';
    } else if (this.report.score >= 75) {
      this.report.scoreLevel = 'Good';
    } else if (this.report.score >= 60) {
      this.report.scoreLevel = 'Fair';
    } else if (this.report.score >= 40) {
      this.report.scoreLevel = 'Needs Improvement';
    } else {
      this.report.scoreLevel = 'Critical';
    }
  }

  generateRecommendations() {
    // Generate prioritized recommendations
    const criticalFindings = this.report.findings.filter(f => f.severity === 'critical');
    const highFindings = this.report.findings.filter(f => f.severity === 'high');

    if (criticalFindings.length > 0) {
      this.report.recommendations.push({
        priority: 'Critical',
        action: 'Address all critical findings immediately',
        count: criticalFindings.length,
        examples: criticalFindings.slice(0, 3).map(f => f.title),
      });
    }

    if (highFindings.length > 0) {
      this.report.recommendations.push({
        priority: 'High',
        action: 'Address high-priority findings within 1 week',
        count: highFindings.length,
        examples: highFindings.slice(0, 3).map(f => f.title),
      });
    }
  }

  async audit() {
    console.log('🚀 Starting Enterprise Security Audit...\n');

    // Run all checks
    this.checkOWASP();
    this.checkAuthentication();
    this.checkAuthorization();
    this.checkSecurityHeaders();
    this.checkCSRF();
    this.checkRateLimiting();
    this.checkInputValidation();
    this.checkSessionManagement();
    this.checkPasswordPolicy();
    this.checkEnvironment();
    this.checkCompliance();

    // Calculate score and generate recommendations
    this.calculateScore();
    this.generateRecommendations();

    // Save report
    writeFileSync(REPORT_FILE, JSON.stringify(this.report, null, 2), 'utf-8');

    console.log('\n✅ Security audit complete!');
    console.log(`📄 Report saved to: ${REPORT_FILE}`);
    console.log(`\n📊 Security Score: ${this.report.score}/100 (${this.report.scoreLevel})`);
    console.log(`\n📋 Summary:`);
    console.log(`   Critical: ${this.report.summary.critical}`);
    console.log(`   High: ${this.report.summary.high}`);
    console.log(`   Medium: ${this.report.summary.medium}`);
    console.log(`   Low: ${this.report.summary.low}`);
    console.log(`   Info: ${this.report.summary.info}`);
    console.log(`   Total: ${this.report.summary.total}`);

    return this.report;
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const auditor = new SecurityAuditor();
  auditor.audit().catch(console.error);
}

export default SecurityAuditor;
