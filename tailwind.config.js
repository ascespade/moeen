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
        // Brand colors for CSS compatibility
        'brand-primary': '#3b82f6',
        'brand-primary-hover': '#2563eb',
        'brand-secondary': '#a855f7',
        'brand-accent': '#f59e0b',
        'brand-success': '#22c55e',
        'brand-warning': '#f59e0b',
        'brand-error': '#ef4444',
        'brand-border': '#e4e4e7',
        'brand-surface': '#fafafa',
      },
    },
  },
  plugins: [],
};
