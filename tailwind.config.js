/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-200": "#ffbf00",
        "primary-100": "#ffc929",
        "secondary-200": "#00b050",
        "secondary-100": "#0b1a78",
        "customGreen": "rgb(2, 250, 217)",
        "customBlue": 'rgb(8, 65, 252)'
      },
      keyframes:{
        quacke: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
      animation: {
        quacke: 'quacke 1s ease-in-out infinite',
      }
    },
  },
  plugins: [
  ],
};
