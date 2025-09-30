/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-cairo)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: 'var(--brand-primary)',
          'primary-hover': 'var(--brand-primary-hover)',
          secondary: 'var(--brand-secondary)',
          accent: 'var(--brand-accent)',
          success: 'var(--brand-success)',
          warning: 'var(--brand-warning)',
          error: 'var(--brand-error)',
          border: 'var(--brand-border)',
          surface: 'var(--brand-surface)',
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      backgroundImage: {
        'brand-gradient': 'var(--brand-gradient)',
        'brand-gradient-2': 'var(--brand-gradient-2)',
        'brand-gradient-3': 'var(--brand-gradient-3)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'pulse-soft': 'pulse 2s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translate3d(0, 40px, 0)',
          },
          '100%': {
            opacity: '1',
            transform: 'translate3d(0, 0, 0)',
          },
        },
        slideInRight: {
          '0%': {
            opacity: '0',
            transform: 'translate3d(100%, 0, 0)',
          },
          '100%': {
            opacity: '1',
            transform: 'translate3d(0, 0, 0)',
          },
        },
      },
    },
  },
  plugins: [],
}

