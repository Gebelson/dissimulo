/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Noir Criminal Official Tokens (from 02_STYLE_GUIDE_NOIR_CRIMINAL.md)
        "noir-bg": "#0C0B0A",
        "noir-surface": "#171411",
        "noir-raised": "#221D19",
        "noir-ink": "#111011",
        "noir-paper": "#D8C8AC",
        "noir-paper-ink": "#30231C",
        "noir-text": "#F2EDE4",
        "noir-muted": "#C2B7AA",
        "noir-border": "#4A3A32",
        "noir-border-light": "#6A5548",
        "noir-brass": "#B79A70",
        "noir-brass-dark": "#7A6242",
        "noir-crimson": "#9F3D3D",
        "noir-crimson-dark": "#4A1616",
        "noir-crimson-light": "#F1A8A4",
        "noir-safe": "#73917B",
        "noir-ghost": "#7B849D",
        "noir-focus": "#EBC28D",

        // Semantic Aliases mapped to Noir Palette
        background: "#0C0B0A",
        "background-dark": "#070605",
        surface: "#171411",
        "surface-elevated": "#221D19",
        "surface-highlight": "#2E2722",
        border: "#4A3A32",
        "border-glow": "rgba(183, 154, 112, 0.3)",
        primary: "#F2EDE4",
        secondary: "#C2B7AA",
        muted: "#8C8074",

        // Themed game roles & status
        investigation: "#B79A70", // Antique Brass
        "investigation-dark": "#7A6242",
        protection: "#73917B",    // Desaturated Sage / Defense
        danger: "#9F3D3D",        // Wine Crimson / Killer
        "danger-dark": "#4A1616",
        eco: "#7B849D",           // Cold Slate Charcoal / Spectral
        alert: "#B79A70",         // Brass Accent
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Playfair Display", "Georgia", "serif"],
        display: ["'Cormorant Garamond'", "Playfair Display", "Georgia", "serif"],
        sans: ["'Manrope'", "'Inter'", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["'IBM Plex Mono'", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        "noir-card": "0 10px 25px -5px rgba(0, 0, 0, 0.8), 0 2px 6px rgba(0, 0, 0, 0.5)",
        "noir-paper": "0 6px 18px rgba(0, 0, 0, 0.5), inset 0 0 40px rgba(74, 58, 50, 0.12)",
        "noir-crimson": "0 8px 25px -4px rgba(159, 61, 61, 0.35)",
        "noir-brass": "0 8px 25px -4px rgba(183, 154, 112, 0.25)",
        "noir-eco": "0 8px 25px -4px rgba(123, 132, 157, 0.2)",
        "tactile-primary": "0 4px 0 #4A1616, 0 8px 16px rgba(0, 0, 0, 0.6)",
        "tactile-secondary": "0 4px 0 #0E0D0C, 0 8px 16px rgba(0, 0, 0, 0.5)",
      },
      borderRadius: {
        "sm": "8px",
        "md": "12px",
        "lg": "18px",
      },
      animation: {
        "pulse-slow": "pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in-dramatic": "fadeInDramatic 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        fadeInDramatic: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
