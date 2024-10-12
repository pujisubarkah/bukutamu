/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/*.{html,js}",
    "./src/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: '#2003b', // Kode warna merah marun
      },
    },
  },
  plugins: [],
  daisyui: {
    themes: ["cupcake", "dark", "cmyk"],
  },
}

