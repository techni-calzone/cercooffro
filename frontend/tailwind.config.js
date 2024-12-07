/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', ...defaultTheme.fontFamily.sans],
        'display': ['Manrope', ...defaultTheme.fontFamily.sans],
        'body': ['Inter', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        cercooffro: {
          primary: '#2563EB',
          secondary: '#10B981',
          accent: '#6366F1',
          background: '#F3F4F6',
          text: '#1F2937'
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)' 
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)' 
          }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
