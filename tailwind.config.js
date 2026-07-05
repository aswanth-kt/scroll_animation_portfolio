/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F2740",
        paper: "#ECEEF2",
        line: "#4C6478",
        signal: "#F2A93B",
        steel: "#183552",
      },
      fontFamily: {
        display: ["IBM Plex Mono", "monospace"],
        body: ["IBM Plex Sans", "sans-serif"],
      },
      boxShadow: {
        blueprint: "inset 0 0 0 1px rgba(76,100,120,0.34)",
      },
    },
  },
  plugins: [],
};
