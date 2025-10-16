require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "next/core-web-vitals"
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  ignorePatterns: [
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "reports/**",
    "public/**",
    "temp_complex/**",
    "src/__tests__/**",
    "src/scripts/**",
    "src/lib/security-enhanced.ts",
    "src/lib/websocket-server.ts",
  ],
  rules: {
    // TypeScript specific rules
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-non-null-assertion": "warn",
    
    // React specific rules
    "react/no-unescaped-entities": "off",
    "react-hooks/exhaustive-deps": "warn",
    "react/jsx-key": "error",
    
    // General rules
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-debugger": "error",
    "no-unused-vars": "off", // Use TypeScript version instead
    "prefer-const": "error",
    "no-var": "error",
    
    // Import rules
    "import/order": ["warn", {
      "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
      "newlines-between": "always",
      "alphabetize": { "order": "asc", "caseInsensitive": true }
    }],
    
    // Prettier integration
    "prettier/prettier": "error"
  },
  overrides: [
    // Node scripts are not part of the Next.js runtime
    {
      files: ["scripts/**/*.js"],
      env: { node: true },
      rules: {
        "@next/next/no-assign-module-variable": "off",
        "@typescript-eslint/no-var-requires": "off",
        "no-console": "off"
      },
    },
    // Allow <img> in this specialized component
    {
      files: ["src/components/common/PerformanceOptimizedImage.tsx"],
      rules: {
        "@next/next/no-img-element": "off",
      },
    },
    // Reduce noisy warnings in specific utility modules
    {
      files: [
        "src/hooks/usePerformance.ts",
        "src/lib/responsive-design.ts",
        "src/lib/translations-manager.ts",
      ],
      rules: {
        "react-hooks/exhaustive-deps": "off",
        "import/no-anonymous-default-export": "off",
      },
    },
    // API routes specific rules
    {
      files: ["src/app/api/**/*.ts"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off", // API routes often need any for request bodies
        "no-console": "off" // API routes may need console for debugging
      }
    },
    // Test files
    {
      files: ["**/*.test.ts", "**/*.test.tsx", "**/__tests__/**/*"],
      env: { jest: true },
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "no-console": "off"
      }
    }
  ],
  env: {
    browser: true,
    es2022: true,
    node: true
  }
};
