/** @type {import('tailwindcss').Config} */
const { DESIGN_TOKENS } = require('./src/design-system/unified');

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Font families from design system
      fontFamily: DESIGN_TOKENS.typography.fontFamily,
      
      // Spacing from design system
      spacing: DESIGN_TOKENS.spacing,
      
      // Container configuration
      container: {
        center: true,
        padding: {
          DEFAULT: DESIGN_TOKENS.spacing[4],
          sm: DESIGN_TOKENS.spacing[4],
          md: DESIGN_TOKENS.spacing[5],
          lg: DESIGN_TOKENS.spacing[6],
          xl: DESIGN_TOKENS.spacing[8],
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },
      
      // Breakpoints from design system
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      // Colors from design system
      colors: {
        // Brand colors (Solid brand colors)
        brand: {
          primary: "var(--brand-primary)",
          "primary-hover": "var(--brand-primary-hover)",
          secondary: "var(--brand-secondary)",
          "neutral-beige": "var(--brand-neutral-beige)",
          accent: "var(--brand-accent)",
          "accent-deep": "var(--brand-accent-deep)",
          success: "var(--brand-success)",
          warning: "var(--brand-warning)",
          error: "var(--brand-error)",
          border: "var(--brand-border)",
          surface: "var(--brand-surface)",
        },
        
        // System colors
        background: "var(--background)",
        foreground: "var(--foreground)",
        panel: "var(--panel)",
        
        // Design system color palettes (Solid brand colors)
        orange: DESIGN_TOKENS.colors.primary,
        brown: DESIGN_TOKENS.colors.secondary,
        neutral: DESIGN_TOKENS.colors.neutral,
        
        // Legacy color mappings - map to orange (primary)
        blue: {
          50: "color-mix(in oklab, var(--brand-primary) 5%, #fff)",
          100: "color-mix(in oklab, var(--brand-primary) 10%, #fff)",
          200: "color-mix(in oklab, var(--brand-primary) 20%, #fff)",
          300: "color-mix(in oklab, var(--brand-primary) 30%, #fff)",
          400: "color-mix(in oklab, var(--brand-primary) 40%, #fff)",
          500: "var(--brand-primary)",
          600: "var(--brand-primary-hover)",
          700: "var(--brand-primary-hover)",
          800: "var(--brand-primary-hover)",
          900: "var(--brand-primary-hover)",
        },
        purple: {
          50: "color-mix(in oklab, var(--brand-primary) 5%, #fff)",
          100: "color-mix(in oklab, var(--brand-primary) 10%, #fff)",
          200: "color-mix(in oklab, var(--brand-primary) 20%, #fff)",
          300: "color-mix(in oklab, var(--brand-primary) 30%, #fff)",
          400: "color-mix(in oklab, var(--brand-primary) 40%, #fff)",
          500: "var(--brand-primary)",
          600: "var(--brand-primary-hover)",
          700: "var(--brand-primary-hover)",
          800: "var(--brand-primary-hover)",
          900: "var(--brand-primary-hover)",
        },
        indigo: {
          50: "color-mix(in oklab, var(--brand-primary) 5%, #fff)",
          100: "color-mix(in oklab, var(--brand-primary) 10%, #fff)",
          200: "color-mix(in oklab, var(--brand-primary) 20%, #fff)",
          300: "color-mix(in oklab, var(--brand-primary) 30%, #fff)",
          400: "color-mix(in oklab, var(--brand-primary) 40%, #fff)",
          500: "var(--brand-primary)",
          600: "var(--brand-primary-hover)",
          700: "var(--brand-primary-hover)",
          800: "var(--brand-primary-hover)",
          900: "var(--brand-primary-hover)",
        },
      },
      // Typography from design system
      fontSize: DESIGN_TOKENS.typography.fontSize,
      fontWeight: DESIGN_TOKENS.typography.fontWeight,
      lineHeight: DESIGN_TOKENS.typography.lineHeight,
      
      // Border radius from design system
      borderRadius: DESIGN_TOKENS.borderRadius,
      
      // Shadows from design system
      boxShadow: DESIGN_TOKENS.shadows,
      
      // Z-index from design system
      zIndex: DESIGN_TOKENS.zIndex,
      
      // Animation from design system
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "slide-in-right": "slideInRight 0.6s ease-out",
        "pulse-soft": "pulse 2s infinite",
      },
      
      // Keyframes
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
      
      // Background images
      backgroundImage: {
        "brand-gradient": "var(--brand-gradient)",
        "brand-gradient-2": "var(--brand-gradient-2)",
        "brand-gradient-3": "var(--brand-gradient-3)",
      },
    },
  },
  plugins: [],
};
