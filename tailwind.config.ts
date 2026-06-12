import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "'Helvetica Neue'", "Helvetica", "Arial", "sans-serif"],
        mono: ["'SF Mono'", "SFMono-Regular", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
