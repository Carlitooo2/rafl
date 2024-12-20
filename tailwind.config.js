/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './templates/**/*.{html,js}',  // Pointing to your templates directory
      './static/**/*.{html,js}',     // Pointing to static files if needed
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }