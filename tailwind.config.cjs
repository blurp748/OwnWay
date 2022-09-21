/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,svelte,js,ts}'],
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["wireframe"],
  },
  theme: {
    extend: {
      colors: {
        'spiced-apple': '#783937ff',
        'peach' : "#f1ac88ff"
      },
    }
  }
}
