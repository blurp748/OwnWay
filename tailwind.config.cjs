/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,svelte,js,ts}'],
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["dark", "wireframe"],
  }
}
