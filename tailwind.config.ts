import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
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
        primary: "#323232",
        secondary: "#969696",
        tertiary: "#D8D8D8",
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
  },
  plugins: [],
} satisfies Config;
