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
        // Centralized aliases to keep legacy classes consistent with brand
        blue: {
          50: "color-mix(in oklab, var(--brand-primary) 5%, #fff)",
          100: "color-mix(in oklab, var(--brand-primary) 10%, #fff)",
          500: "var(--brand-primary)",
          600: "var(--brand-primary)",
          700: "var(--brand-primary-hover)",
        },
        purple: {
          50: "#fffbeb", // amber-50
          100: "#fef3c7", // amber-100
          600: "#b45309", // amber-700
        },
        indigo: {
          50: "#fdf8f6", // brown-50
          100: "#f2e8e5", // brown-100
          600: "#a18072", // brown-600
        },
        // Brown and orange theme colors
        brown: {
          50: "#fdf8f6",
          100: "#f2e8e5",
          200: "#eaddd7",
          300: "#e0cec7",
          400: "#d2bab0",
          500: "#bfa094",
          600: "#a18072",
          700: "#977669",
          800: "#846358",
          900: "#43302b",
        },
        orange: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        // Centralize legacy blue/purple/indigo usages to brand orange
        blue: {
          50: "rgb(245,130,32)",
          100: "rgb(245,130,32)",
          200: "rgb(245,130,32)",
          300: "rgb(245,130,32)",
          400: "rgb(245,130,32)",
          500: "rgb(245,130,32)",
          600: "rgb(245,130,32)",
          700: "rgb(210,111,24)",
          800: "rgb(194,94,15)",
          900: "rgb(124,45,18)",
        },
        purple: {
          50: "rgb(245,130,32)",
          100: "rgb(245,130,32)",
          200: "rgb(245,130,32)",
          300: "rgb(245,130,32)",
          400: "rgb(245,130,32)",
          500: "rgb(245,130,32)",
          600: "rgb(245,130,32)",
          700: "rgb(210,111,24)",
          800: "rgb(194,94,15)",
          900: "rgb(124,45,18)",
        },
        indigo: {
          50: "rgb(245,130,32)",
          100: "rgb(245,130,32)",
          200: "rgb(245,130,32)",
          300: "rgb(245,130,32)",
          400: "rgb(245,130,32)",
          500: "rgb(245,130,32)",
          600: "rgb(245,130,32)",
          700: "rgb(210,111,24)",
          800: "rgb(194,94,15)",
          900: "rgb(124,45,18)",
        },
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
