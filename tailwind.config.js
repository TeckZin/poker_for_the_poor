/** @type {import('tailwindcss').Config} */


const plugin = require('tailwindcss/plugin');
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
            'ibm-plex-mono': ['"IBM Plex Mono"', 'bold'],
        },

    },
  },
     plugins: [
        plugin(function ({ addUtilities }) {
          addUtilities({
            '.button-custom-hover-class': {
              '@apply hover:border-4 hover:border-white transition-all duration-300': {}
            },
          })
        })
      ],
}


