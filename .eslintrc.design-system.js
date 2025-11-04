/**
 * ESLint Rules for Design System Enforcement
 * قواعد ESLint لإجبار الالتزام بنظام التصميم
 */

module.exports = {
  rules: {
    // Prevent hardcoded colors
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Literal[value=/^(bg-|text-|border-)(gray|red|blue|green|yellow|purple|pink|indigo|teal|orange|white|black)-\\d+/]',
        message: 'استخدم CSS variables بدلاً من الألوان المكودة. استخدم bg-[var(--background)] بدلاً من bg-white',
      },
      {
        selector: 'TemplateElement[value.raw=/bg-(gray|red|blue|green|yellow|purple|pink|indigo|teal|orange|white|black)-\\d+/]',
        message: 'استخدم CSS variables بدلاً من الألوان المكودة في template literals',
      },
    ],
    // Prevent bg-background without var
    'no-restricted-strings': [
      'error',
      {
        patterns: [
          {
            group: ['bg-background(?!\\[var\\(--\\)])', 'bg-white(?!\\[var\\(--\\)])', 'bg-black(?!\\[var\\(--\\)])'],
            message: 'استخدم bg-[var(--background)] بدلاً من bg-background أو bg-white',
          },
        ],
      },
    ],
  },
};
