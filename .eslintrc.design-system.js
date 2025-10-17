/**
 * ESLint Rules for Design System Enforcement
 * قواعد ESLint لفرض نظام التصميم
 */

module.exports = {
  rules: {
    // Enforce using design system colors
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Literal[value=/bg-(blue|red|green|yellow|purple|indigo|pink)-(\\d{3})/]',
        message: '❌ Use design system colors: bg-brand-primary, bg-brand-success, etc. instead of hardcoded colors',
      },
      {
        selector: 'Literal[value=/text-(blue|red|green|yellow|purple|indigo|pink)-(\\d{3})/]',
        message: '❌ Use design system colors: text-brand-primary, text-brand-success, etc. instead of hardcoded colors',
      },
      {
        selector: 'Literal[value=/#[0-9A-Fa-f]{6}/]',
        message: '❌ Use design system colors from CSS variables instead of hex colors',
      },
    ],
    
    // Enforce importing from central location
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@/components/common/LoadingSpinner', '@/components/shared/LoadingSpinner'],
            message: '❌ Import from @/components/ui instead',
          },
          {
            group: ['@/components/common/Skeleton', '@/components/shared/Skeleton'],
            message: '❌ Import from @/components/ui instead',
          },
          {
            group: ['@/components/common/ThemeToggle', '@/components/theme/*'],
            message: '❌ Import from @/components/ui instead',
          },
        ],
      },
    ],
  },
};
