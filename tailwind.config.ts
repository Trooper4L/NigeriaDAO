import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        "nigeria-green": "#008751",
        "flow-blue": "#00EF8B",
        "deep-space": "#0B0E11",
        "panel-elevated": "#11161D",
        "ink-muted": "#9FB3C8"
      },
      boxShadow: {
        secure: "0 20px 48px rgba(0, 0, 0, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
