import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindcssAspectRatio from "@tailwindcss/aspect-ratio";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // ===========================================
      // HAIR STUDIO DESIGN SYSTEM - Mobile First
      // ===========================================
      
      // Font Family
      fontFamily: {
        sans: ['Work Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Work Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      
      // Typography Scale (mobile-optimized)
      fontSize: {
        // Display - Hero text
        'display': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-sm': ['1.875rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '800' }],
        // Title - Section headers
        'title-lg': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'title': ['1.25rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '700' }],
        'title-sm': ['1.125rem', { lineHeight: '1.3', fontWeight: '600' }],
        // Body - Main content
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        // Caption - Small text
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '500' }],
        'caption-sm': ['0.6875rem', { lineHeight: '1.3', letterSpacing: '0.02em', fontWeight: '500' }],
        // Label - Buttons, badges
        'label': ['0.875rem', { lineHeight: '1', letterSpacing: '0.01em', fontWeight: '600' }],
        'label-sm': ['0.75rem', { lineHeight: '1', letterSpacing: '0.02em', fontWeight: '600' }],
      },
      
      // Spacing Scale (8px base, mobile-friendly)
      spacing: {
        '4.5': '1.125rem',   // 18px
        '13': '3.25rem',     // 52px
        '15': '3.75rem',     // 60px
        '18': '4.5rem',      // 72px - touch target
        '22': '5.5rem',      // 88px
        'safe-top': 'var(--safe-area-top)',
        'safe-bottom': 'var(--safe-area-bottom)',
        'header': 'var(--header-height)',
        'bottom-bar': 'var(--bottom-bar-height)',
      },
      
      // Border Radius (modern, larger for mobile)
      borderRadius: {
        'lg': 'var(--radius)',
        'md': 'calc(var(--radius) - 2px)',
        'sm': 'calc(var(--radius) - 4px)',
        '2xl': '1rem',       // 16px
        '3xl': '1.5rem',     // 24px - cards, modals
        '4xl': '2rem',       // 32px - bottom sheets
        'button': '0.75rem', // 12px - buttons
        'card': '1.25rem',   // 20px - cards
        'modal': '1.75rem',  // 28px - modals
      },
      
      // Shadows (subtle, premium feel)
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(0, 0, 0, 0.08)',
        'soft-md': '0 4px 16px -4px rgba(0, 0, 0, 0.1)',
        'soft-lg': '0 8px 32px -8px rgba(0, 0, 0, 0.12)',
        'soft-xl': '0 16px 48px -12px rgba(0, 0, 0, 0.15)',
        'glow-amber': '0 4px 24px -4px rgba(245, 158, 11, 0.35)',
        'glow-purple': '0 4px 24px -4px rgba(139, 92, 246, 0.35)',
        'glow-blue': '0 4px 24px -4px rgba(59, 130, 246, 0.35)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.04)',
        'button': '0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.12)',
        'button-hover': '0 2px 6px rgba(0, 0, 0, 0.1), 0 8px 24px -4px rgba(0, 0, 0, 0.15)',
        'card': '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px -4px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 2px 4px rgba(0, 0, 0, 0.06), 0 8px 24px -4px rgba(0, 0, 0, 0.12)',
        'modal': '0 24px 48px -12px rgba(0, 0, 0, 0.2)',
        'bottom-sheet': '0 -4px 32px -4px rgba(0, 0, 0, 0.1)',
      },
      
      // Surface Colors (Hair Studio brand)
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Brand Colors
        brand: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',  // Primary amber
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Surface colors for layering
        surface: {
          DEFAULT: '#ffffff',
          raised: '#fafafa',
          sunken: '#f4f4f5',
          overlay: 'rgba(255, 255, 255, 0.95)',
          'overlay-dark': 'rgba(0, 0, 0, 0.5)',
        },
        // Premium accent
        premium: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
      },
      
      // Keyframe Animations
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "skeleton-wave": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "bounce-soft": "bounce-soft 1s ease-in-out infinite",
        "skeleton-wave": "skeleton-wave 1.8s ease-in-out infinite",
      },
      
      // Background Images (gradients)
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
        'gradient-brand-soft': 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
        'gradient-premium': 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
        'gradient-premium-soft': 'linear-gradient(135deg, #faf5ff 0%, #eef2ff 100%)',
        'gradient-success': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'gradient-surface': 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
        'gradient-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
      },
      
      // Backdrop Blur
      backdropBlur: {
        'xs': '2px',
      },
      
      // Z-index scale
      zIndex: {
        'header': '50',
        'modal': '100',
        'popover': '150',
        'toast': '200',
      },
      
      // Min height for touch targets
      minHeight: {
        'touch': '44px',
        'touch-lg': '48px',
        'touch-xl': '56px',
      },
      
      // Min width for touch targets
      minWidth: {
        'touch': '44px',
      },
    },
  },
  plugins: [tailwindcssAnimate, tailwindcssAspectRatio],
} satisfies Config;
