/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/preline/preline.js',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors - from homepage design system (matches centralized.css)
        'brand-primary': '#f97316',
        'brand-primary-hover': '#ea580c',
        'brand-secondary': '#eab308',
        'brand-accent': '#0284c7',
        'brand-success': '#008a7a',
        'brand-warning': '#e68900',
        'brand-error': '#dc2626',
        'brand-info': '#0284c7',
        'brand-border': '#cbd5e1',
        'brand-surface': '#f1f5f9',
        
        // Feature colors - from homepage
        'feature-innovation': '#22c55e',
        'feature-inclusivity': '#3b82f6',
        'feature-quality-start': '#eab308',
        'feature-quality-end': '#f97316',
        'feature-care-start': '#ec4899',
        'feature-care-end': '#ef4444',
        
        // Text colors
        'text-primary': '#1e293b',
        'text-secondary': '#475569',
        'text-muted': '#64748b',
      },
      fontFamily: {
        sans: [
          'Tajawal',
          'Noto Sans Arabic',
          'Cairo',
          'Amiri',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Inter',
          'Roboto',
          'system-ui',
          'sans-serif',
        ],
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      spacing: {
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        8: '2rem',
        10: '2.5rem',
        12: '3rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(16, 24, 40, 0.05)',
        md: '0 4px 6px rgba(2, 6, 23, 0.08)',
        lg: '0 10px 15px rgba(2, 6, 23, 0.12)',
        xl: '0 20px 25px rgba(2, 6, 23, 0.15)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
      },
      maxWidth: {
        'container': '1200px',
      },
    },
  },
  plugins: [],
  corePlugins: {
    outline: true,
  },
  darkMode: 'class',
};
