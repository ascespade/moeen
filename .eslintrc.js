require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: ["next/core-web-vitals"],
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
};
