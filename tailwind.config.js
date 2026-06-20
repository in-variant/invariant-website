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
        display: ['SeasonMix', 'Fraunces', 'Georgia', 'serif'], // hero + section headings
        // Geist everywhere. font-sans AND font-mono both resolve to Geist
        // so legacy `font-mono` usages still render in the new font.
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['Geist', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],     // editorial body on doc pages only
        grotesk: ['Geist', 'sans-serif'],              // legacy alias
      },
    },
  },
  plugins: [],
}
