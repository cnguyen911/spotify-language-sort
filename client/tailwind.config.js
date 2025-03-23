/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'spotify-green': '#1DB954',
        'spotify-black': '#191414',
        'spotify-white': '#FFFFFF',
        'spotify-grey': '#B3B3B3',
      },
    },
  },
  plugins: [
    require('daisyui'), // Only add if you installed daisyUI
  ],
  // daisyUI config (optional)
  daisyui: {
    themes: [
      {
        spotify: {
          primary: "#1DB954",
          secondary: "#191414",
          accent: "#1ED760",
          neutral: "#282828",
          "base-100": "#121212",
        },
      },
    ],
  },
}