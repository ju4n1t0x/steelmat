module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Source Sans Pro"', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ]
}