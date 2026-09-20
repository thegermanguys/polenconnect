import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1320px" },
    },
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        "surface-2": "hsl(var(--surface-2))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--red))",
          foreground: "hsl(var(--red-foreground))",
        },
        "red-deep": "hsl(var(--red-deep))",
        secondary: {
          DEFAULT: "hsl(var(--graphite))",
          foreground: "hsl(var(--graphite-foreground))",
        },
        graphite: {
          DEFAULT: "hsl(var(--graphite))",
          foreground: "hsl(var(--graphite-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--gold))",
          foreground: "hsl(var(--gold-foreground))",
        },
        slate: {
          DEFAULT: "hsl(var(--slate))",
          foreground: "hsl(var(--slate-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        flag: {
          red: "#DC143C",
          white: "#FFFFFF",
          gold: "#D4AF37",
        },
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
        "3xl": "2.25rem",
      },
      boxShadow: {
        soft: "0 2px 10px -2px rgb(0 0 0 / 0.06), 0 8px 30px -8px rgb(0 0 0 / 0.10)",
        lift: "0 8px 24px -6px rgb(0 0 0 / 0.12), 0 20px 48px -12px rgb(0 0 0 / 0.18)",
        glow: "0 0 0 1px hsl(var(--gold) / 0.25), 0 12px 40px -8px hsl(var(--red) / 0.35)",
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(120% 120% at 15% 0%, hsl(var(--graphite) / 0.95) 0%, hsl(var(--graphite)) 38%, hsl(222 40% 9%) 78%)",
        "flag-strip":
          "repeating-linear-gradient(90deg, #FFFFFF 0 50%, #DC143C 50% 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        flutter: {
          "0%, 100%": { transform: "skewX(0deg)" },
          "50%": { transform: "skewX(-2deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        flutter: "flutter 3.5s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
