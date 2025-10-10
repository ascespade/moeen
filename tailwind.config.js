/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-cairo)",
          "var(--font-inter)",
          "system-ui",
          "sans-serif",
        ],
      },
      spacing: {
        1.5: "0.375rem",
        4.5: "1.125rem",
        7: "1.75rem",
        9: "2.25rem",
        11: "2.75rem",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1rem",
          md: "1.25rem",
          lg: "1.5rem",
          xl: "2rem",
        },
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1440px",
        },
      },
      colors: {
        brand: {
          primary: "var(--brand-primary)",
          "primary-hover": "var(--brand-primary-hover)",
          secondary: "var(--brand-secondary)",
          accent: "var(--brand-accent)",
          success: "var(--brand-success)",
          warning: "var(--brand-warning)",
          error: "var(--brand-error)",
          border: "var(--brand-border)",
          surface: "var(--brand-surface)",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        panel: "var(--panel)",
      },
      backgroundImage: {
        "brand-gradient": "var(--brand-gradient)",
        "brand-gradient-2": "var(--brand-gradient-2)",
        "brand-gradient-3": "var(--brand-gradient-3)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "slide-in-right": "slideInRight 0.6s ease-out",
        "pulse-soft": "pulse 2s infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translate3d(0, 40px, 0)",
          },
          "100%": {
            opacity: "1",
            transform: "translate3d(0, 0, 0)",
          },
        },
        slideInRight: {
          "0%": {
            opacity: "0",
            transform: "translate3d(100%, 0, 0)",
          },
          "100%": {
            opacity: "1",
            transform: "translate3d(0, 0, 0)",
          },
        },
      },
    },
  },
  plugins: [],
};
