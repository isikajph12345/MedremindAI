/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        background: "#F8FAFC",
        darkText: "#1E293B",
        accentRed: "#EF4444",
        successGreen: "#10B981"
      }
    },
  },
  plugins: [],
}