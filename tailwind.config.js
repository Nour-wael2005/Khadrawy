/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#1D4533",
        cream: "cream",
        peach: "#F9D2BA",
        earthy: "earthy",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Cairo", "sans-serif"],
      },
    },
  },
  plugins: [],
};
