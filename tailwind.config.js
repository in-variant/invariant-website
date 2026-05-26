/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Foundation
        midnight: '#1B2436',
        observatory: '#425D77',
        mineral: '#D9D6D1',
        cloud: '#ECEAE7',
        // Accents
        copper: '#C57A3E',
        peach: '#E4CBBE',
        lavender: '#7F7A93',
        // System
        paper: '#FAFAF7',
        ink: '#1B2436',     // brand ink == Midnight
        mid: '#6B6B66',
        rule: '#C9C5BD',
        dim: '#CCCCCC',
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],          // display / headings
        sans: ['Satoshi', 'Inter', 'system-ui', 'sans-serif'], // body / UI
        mono: ['"IBM Plex Mono"', 'monospace'],              // labels / metadata
        grotesk: ['Newsreader', 'serif'],                    // legacy alias -> serif
      },
    },
  },
  plugins: [],
}
