import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#091426",
        "primary-container": "#1e293b",
        "on-primary": "#ffffff",
        "on-primary-container": "#8590a6",
        "primary-fixed": "#111c2d",
        "primary-fixed-dim": "#bcc7de",
        secondary: "#515f74",
        "on-secondary": "#ffffff",
        "secondary-fixed": "#d5e3fd",
        "secondary-fixed-dim": "#b9c7e0",
        tertiary: "#1e1200",
        "on-tertiary": "#ffffff",
        "tertiary-fixed": "#fadfb8",
        "tertiary-fixed-dim": "#ddc39d",
        background: "#f7f9fb",
        "on-background": "#191c1e",
        surface: "#f7f9fb",
        "on-surface": "#191c1e",
        "surface-variant": "#e0e3e5",
        "on-surface-variant": "#45474c",
        "surface-container": "#eceef0",
        "surface-container-low": "#f2f4f6",
        "surface-container-high": "#e6e8ea",
        "surface-container-highest": "#e0e3e5",
        "surface-container-lowest": "#ffffff",
        outline: "#75777d",
        "outline-variant": "#c5c6cd",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
      },
      fontFamily: {
        sans: ["Public Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
