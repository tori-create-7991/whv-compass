import type { Config } from "tailwindcss";

/**
 * Terracotta design tokens (see docs/design-system.md).
 * Components must use these semantic names, never raw hex.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        sand: "var(--sand)",
        primary: { DEFAULT: "var(--primary)", strong: "var(--primary-strong)" },
        ink: { DEFAULT: "var(--ink)", muted: "var(--ink-muted)" },
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
      },
      fontFamily: {
        display: ["var(--font-dm-serif)", "var(--font-noto-serif-jp)", "serif"],
        sans: ["var(--font-noto-sans-jp)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: { DEFAULT: "8px", card: "12px" },
      spacing: { "1": "4px", "2": "8px", "3": "12px", "4": "16px", "6": "24px", "8": "32px" },
    },
  },
  plugins: [],
};

export default config;
