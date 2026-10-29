/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B1018",
        surface: "#151D29",
        "surface-elevated": "#202C3B",
        border: "#2A384C",
        primary: "#F4F7FB",
        secondary: "#AAB9CC",
        investigation: "#72D2DE", // Cyan
        protection: "#45D1A0",   // Green
        danger: "#F36B7A",       // Red / Killer
        eco: "#A99BFF",          // Lilac / Eco
        alert: "#F2C46D",        // Amber
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
