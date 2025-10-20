{
    "mode": "ultra_finalizer",
    "project": {
      "name": "مركز الهمم",
      "type": "medical_center_system",
      "framework": "Next.js",
      "database": "Supabase",
      "goal": "Fully functional, connected, tested, and production-ready system"
    },
    "engine": {
      "executor": "cursor-ai",
      "backgroundExecution": true,
      "safeParallelMode": true,
      "maxConcurrency": "auto",
      "continuousHealing": true,
      "environmentSync": "cursor-agent"
    },
    "phases": [
      {
        "name": "Project Cleanup",
        "description": "Scan and remove any mock data, simulations, or placeholder code from all directories.",
        "actions": [
          "Find and delete all mock/, __mocks__/, fakeData/, simulation/ folders",
          "Remove any mock imports or placeholders from test and src files",
          "Ensure all components and APIs read from real database only"
        ],
        "autoConfirm": true
      },
      {
        "name": "Database Link & API Restoration",
        "description": "Rebuild all API endpoints and link every one directly to real DB data. Auto-generate missing endpoints and schemas if required.",
        "tasks": [
          "Scan /api directory and detect missing handlers",
          "Generate new endpoints for missing logic (patients, doctors, appointments, services, etc.)",
          "Ensure CRUD routes exist for each table",
          "Link each endpoint to Supabase via env variables",
          "Validate data response in both Arabic and English"
        ],
        "autoMigrate": true
      },
      {
        "name": "Feature Completion",
        "description": "Detect incomplete or missing modules, pages, components, or logic and rebuild them automatically to fit project structure.",
        "autoBuild": true,
        "rules": {
          "inheritStyling": true,
          "followExistingPatterns": true,
          "skipIfFullyFunctional": true
        }
      },
      {
        "name": "Full Testing Layer",
        "description": "Generate and execute 100+ tests per module using Playwright + Superwright across UI, APIs, and business logic layers.",
        "actions": [
          "Auto-generate tests for all detected pages and routes",
          "Auto-generate API tests for each endpoint",
          "Run all tests in CI simulation mode",
          "Fix failing tests automatically and re-run until success"
        ],
        "selfHealing": true
      },
      {
        "name": "Code Quality & Build Fix",
        "description": "Fix all TypeScript, ESLint, and build warnings/errors automatically.",
        "actions": [
          "Run lint and auto-fix issues",
          "Rebuild project and validate compilation",
          "Ensure all dependencies are clean, no duplication or missing imports"
        ],
        "finalStatus": "✅ Codebase 0 errors / 0 warnings"
      },
      {
        "name": "Performance & Security Optimization",
        "description": "Optimize all assets, remove dead code, enforce lazy loading, sanitize inputs, and validate secure headers.",
        "optimize": [
          "Next.js bundle analyzer",
          "Tree shaking + minification",
          "SQL injection prevention",
          "XSS & CORS validation"
        ],
        "autoPatch": true
      },
      {
        "name": "Finalizer – Full Production Validation",
        "description": "Ensure system is production-ready and verified from A–Z.",
        "steps": [
          "Run npm run build --dry-run",
          "Check for unused assets/components",
          "Verify SEO metadata (titles, descriptions, structured data)",
          "Validate sitemap.xml, robots.txt, manifest.json",
          "Ensure all environment variables are valid and loaded",
          "Verify deployment config (Render/Vercel/Netlify) exists",
          "Auto-generate README.md and documentation"
        ],
        "outputs": {
          "status": "🟢 System ready for production deployment",
          "reportFile": "reports/final_summary_production.md"
        }
      }
    ],
    "reporting": {
      "verbose": true,
      "progressBar": true,
      "autoCommit": true,
      "commitMessage": "🚀 Full Auto-Healing, Completion, and Finalization for مركز الهمم",
      "onSuccess": {
        "status": "✅ 0 Errors, 0 Warnings, 100% Tests Passed, Production Ready"
      },
      "output": [
        "console",
        "logs/finalizer.log",
        "reports/full_audit.json"
      ]
    }
  }
  