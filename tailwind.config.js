/** @type {import('tailwindcss').Config} */
export default {
  content: ['./resources/**/*.{edge,js,ts,tsx,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        blocky: '4px 4px 0px #000, 8px 8px 0px #999',
      },
    },
  },
  plugins: [require('daisyui')],
}
