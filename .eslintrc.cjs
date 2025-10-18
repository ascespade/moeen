module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
    jasmine: true
  },
  extends: [
    'eslint:recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'camelcase': 'off',
    'no-console': 'off',
    'no-unused-vars': 'off',
    'no-empty': 'warn',
    'radix': 'error',
    'no-prototype-builtins': 'error',
    'prefer-const': 'error',
    'no-constant-condition': 'error',
    'no-const-assign': 'error',
    'no-undef': 'error',
  },
  ignorePatterns: ['node_modules/', 'dist/', '.next/', 'out/'],
};