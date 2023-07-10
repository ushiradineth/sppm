import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      sans: ["var(--font-sans)", ...fontFamily.sans],
      libre: ["var(--font-libre)", ...fontFamily.serif],
    },
    fontSize: {
      display: ["64px", "72px"],
      h1: ["56px", "64px"],
      h2: ["48px", "56px"],
      h3: ["40px", "48px"],
      h4: ["32px", "40px"],
      h5: ["24px", "32px"],
      h6: ["20px", "28px"],
      p: ["16px", "24px"],
      label: ["14px", "22px"],
      tiny: ["12px", "20px"],
    },
    screens: {
      mobile: "375px",
      laptop: "768px",
      desktop: "1024px",
    },
    extend: {
      colors: {
        teak: "#BCA164",
        peach: "#FFF6ED",
        "teak-light-1": "#DDC588",
        "teak-dark-1": "#A3864B",
        "teak-dark-2": "#866A35",
        "peach-dark-1": "#EFE1D4",
        "peach-dark-2": "#E0CDBC",
        "peach-dark-3": "#CBB29C",
        dark: "#323232",
        medium: "#969696",
        light: "#D8D8D8",
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
