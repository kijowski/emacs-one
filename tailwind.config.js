import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./resources/**/*.{edge,js,ts,tsx,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        blocky: '4px 4px 0px #111',
      },
    },
  },
  daisyui: {
    themes: ['dracula', 'dark', 'light'],
  },
  plugins: [daisyui],
}
