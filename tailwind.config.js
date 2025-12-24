/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        dark: {
          bg: "#010409",
          surface: "#1a1e2e",
          border: "#2d3748",
          text: "#e0e7ff",
        },
      },
    },
  },
  plugins: [],
};
