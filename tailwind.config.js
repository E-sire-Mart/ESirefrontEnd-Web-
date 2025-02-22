/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // All files in src folder
    "./pages/**/*.{js,ts,jsx,tsx}", // If you use pages directory
    "./components/**/*.{js,ts,jsx,tsx}", // Components folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
