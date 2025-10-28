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
        // Brand colors for CSS compatibility - must match centralized.css
        'brand-primary': '#e46c0a',
        'brand-primary-hover': '#d45f08',
        'brand-secondary': '#ffa500',
        'brand-accent': '#007bff',
        'brand-success': '#009688',
        'brand-warning': '#f59e0b',
        'brand-error': '#ef4444',
        'brand-info': '#0ea5e9',
        'brand-border': '#e5e7eb',
        'brand-surface': '#f9fafb',
      },
    },
  },
  plugins: [],
};
