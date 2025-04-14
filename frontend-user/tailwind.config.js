/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns:{
        // Creates a grid that automatically fills the space with columns of at least 200px width
        'auto':'repeat(auto-fill, minmax(200px, 1fr))'
      },
      colors:{
        'primary':'#61162d', // TAMIU Maroon color used for key elements
        'secondary':'#b5a36a' // Secondary Gold color used for accents
      }
    },
  },
  plugins: [],
}