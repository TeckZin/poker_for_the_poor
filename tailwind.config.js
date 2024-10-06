/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}"
    ],
  theme: {
    extend: {
        colors: {
            "main-primary-color": "#36393B",
            "main-primary-font-color": "#F7F3E3",
            "button-text-color":  "#FCF0CC",
        },
        fontFamily: {
            'bebas-neue': ['"Bebas Neue"', 'cursive'],
        },

    },
  },
  plugins: [],
}

