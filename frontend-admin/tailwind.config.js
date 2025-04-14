/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      
      // Extend the grid template columns with a custom value for responsive layouts.
      gridTemplateColumns:{

        // 'auto' will create a grid with columns that automatically fill the container,
        // each column having a minimum width of 200px and a maximum width of 1 fraction unit.
        'auto':'repeat(auto-fill, minmax(200px, 1fr))'
      },

      // Extend the color palette with custom colors.
      colors:{

        // TAMIU COLORS
        'primary':'#61162d',    // Define the primary color to be a maroon
        'secondary':'#b5a36a'   // Define the secondary color to be gold
      }
    },
  },
  plugins: [],
}