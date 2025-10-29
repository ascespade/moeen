/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors - must match centralized.css
        'brand-primary': '#e46c0a',
        'brand-primary-hover': '#c55d0a',
        'brand-secondary': '#ff9800',
        'brand-accent': '#0066cc',
        'brand-success': '#008a7a',
        'brand-warning': '#e68900',
        'brand-error': '#dc2626',
        'brand-info': '#0284c7',
        'brand-border': '#cbd5e1',
        'brand-surface': '#f1f5f9',
        // Text colors with better contrast
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
    },
  },
  plugins: [],
  corePlugins: {
    // Disable default focus outline that may cause boxes
    outline: true,
  },
};
