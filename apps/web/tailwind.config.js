/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#070B12",
        "background-dark": "#04070B",
        surface: "#0F1724",
        "surface-elevated": "#182436",
        "surface-highlight": "#22334C",
        border: "#203046",
        "border-glow": "rgba(0, 240, 255, 0.3)",
        primary: "#F8FAFC",
        secondary: "#94A3B8",
        muted: "#64748B",
        // Semantic Game Tokens
        investigation: "#00F0FF", // Laser Cyan
        "investigation-dark": "#0891B2",
        protection: "#10B981",    // Tactical Emerald
        danger: "#FF2A55",        // Blood Crimson / Killer
        "danger-dark": "#BE123C",
        eco: "#A855F7",           // Spectral Amethyst
        alert: "#F59E0B",         // Warning Amber
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        "hud-cyan": "0 0 20px rgba(0, 240, 255, 0.25), inset 0 0 15px rgba(0, 240, 255, 0.1)",
        "hud-crimson": "0 0 20px rgba(255, 42, 85, 0.3), inset 0 0 15px rgba(255, 42, 85, 0.15)",
        "hud-amber": "0 0 20px rgba(245, 158, 11, 0.25)",
        "hud-eco": "0 0 20px rgba(168, 85, 247, 0.25)",
        "tactile": "0 4px 0 #0C121D, 0 8px 16px rgba(0, 0, 0, 0.6)",
        "tactile-pressed": "0 1px 0 #0C121D, 0 2px 4px rgba(0, 0, 0, 0.4)",
      },
      animation: {
        "pulse-fast": "pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "radar-sweep": "radar 4s linear infinite",
        "scanline": "scanline 6s linear infinite",
        "glitch": "glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both",
      },
      keyframes: {
        radar: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
        glitch: {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-3px, 2px)" },
          "40%": { transform: "translate(3px, -2px)" },
          "60%": { transform: "translate(-2px, -1px)" },
          "80%": { transform: "translate(2px, 1px)" },
          "100%": { transform: "translate(0)" },
        },
      },
    },
  },
  plugins: [],
};
