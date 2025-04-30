/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // Enables class-based dark mode (uses `dark:` variants)
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      colors: {
        // 🌤 Serene Sky (Light Theme)
        skyPrimary: "#A4D7E1",
        skySecondary: "#B2E0E6",
        skyAccent: "#C4F1F4",
        skySoft: "#E0F7FA",
        skyLightest: "#E8F9FD",

        // 💜 Luminous Lavender (Light Theme)
        lavenderPrimary: "#E6D6E8",
        lavenderSecondary: "#D1C4E9",
        lavenderAccent: "#B3A1D9",
        lavenderPink: "#E0B2E8",
        lavenderLightest: "#F2E1F6",

        // 🌙 Dark Theme
        darkBg: "#121212",
        darkCard: "#1E1E1E",
        darkAccent: "#2A2A2A",
        darkText: "#E0E0E0",
        darkMuted: "#888888",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
      animation: {
        blob: "blob 7s infinite",
        "animation-delay-2000": "blob 7s infinite 2s",
        "animation-delay-4000": "blob 7s infinite 4s",
      },
    },
  },
  plugins: [],
};
