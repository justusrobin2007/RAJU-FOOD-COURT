/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          DEFAULT: '#FF7A00',
          light:   '#FFA34D',
          dark:    '#CC6200',
        },
        charcoal: {
          DEFAULT: '#0F0F0F',
          light:   '#1E1E1E',
          dark:    '#080808',
          card:    '#161616',
        },
        cream: {
          DEFAULT: '#FAF6EE',
          light:   '#FFFFFF',
          dark:    '#F3EAD8',
        },
        gold: {
          DEFAULT: '#C5A880',
          light:   '#E2D4C1',
          dark:    '#937854',
        },
        maroon: {
          DEFAULT: '#5E1914',
          light:   '#7D2923',
          dark:    '#3E0F0C',
        },
        leaf: {
          DEFAULT: '#2E6F40',
          light:   '#3C9455',
          dark:    '#1E4B2B',
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        sans:     ['Outfit', 'sans-serif'],
      },
      animation: {
        'spin-slow':  'spin 20s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
