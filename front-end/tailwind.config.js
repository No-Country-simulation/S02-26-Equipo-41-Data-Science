/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1a59d5',
        'background-light': '#f6f6f8',
        'background-dark': '#111621',
        'text-primary': '#111318',
        'text-secondary': '#636f88',
        'border-light': '#dcdfe5',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
      boxShadow: {
        'primary': '0 10px 40px -10px rgba(26, 89, 213, 0.2)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}