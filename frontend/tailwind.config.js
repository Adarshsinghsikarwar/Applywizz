/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f6f7f9",
          100: "#eceef2",
          200: "#d7dbe3",
          300: "#b3bac8",
          400: "#8992a6",
          500: "#5f6b82",
          600: "#465068",
          700: "#333c50",
          800: "#232a3a",
          900: "#161b27",
        },
        signal: {
          50: "#eef6f6",
          100: "#d7ebe9",
          400: "#3f9c94",
          500: "#2f7f78",
          600: "#24645f",
        },
        alert: {
          100: "#fbe7e2",
          500: "#c15a3d",
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
