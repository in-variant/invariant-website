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
        midnight: 'rgb(var(--site-color-midnight, 27 36 54) / <alpha-value>)',
        observatory: 'rgb(var(--site-color-observatory, 66 93 119) / <alpha-value>)',
        mineral: 'rgb(var(--site-color-mineral, 217 214 209) / <alpha-value>)',
        cloud: 'rgb(var(--site-color-cloud, 236 234 231) / <alpha-value>)',
        // Accents
        copper: 'rgb(var(--site-color-copper, 197 122 62) / <alpha-value>)',
        peach: 'rgb(var(--site-color-peach, 228 203 190) / <alpha-value>)',
        lavender: 'rgb(var(--site-color-lavender, 127 122 147) / <alpha-value>)',
        // System
        paper: 'rgb(var(--site-color-paper, 250 250 247) / <alpha-value>)',
        ink: 'rgb(var(--site-color-ink, 27 36 54) / <alpha-value>)',     // brand ink == Midnight
        mid: 'rgb(var(--site-color-mid, 107 107 102) / <alpha-value>)',
        rule: 'rgb(var(--site-color-rule, 201 197 189) / <alpha-value>)',
        dim: 'rgb(var(--site-color-dim, 204 204 204) / <alpha-value>)',
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
