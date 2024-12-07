import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Vibrant, modern color palette with a tech-forward feel
        'cercooffro-primary': '#5E3CD1',     // Deep Purple
        'cercooffro-secondary': '#00A896',   // Teal
        'cercooffro-accent': '#FF6B6B',      // Coral Red
        'cercooffro-background': '#F4F7F6',  // Soft Mint Gray
        'cercooffro-text': '#2C3E50',        // Dark Slate
        'cercooffro-muted': '#7F8C8D',       // Cool Gray
      },
      fontFamily: {
        'display': ['Inter', 'sans-serif'],
        'body': ['Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cercooffro-gradient': 'linear-gradient(135deg, #5E3CD1 0%, #00A896 50%, #FF6B6B 100%)',
        'cercooffro-subtle-gradient': 'linear-gradient(to right, rgba(94, 60, 209, 0.1), rgba(0, 168, 150, 0.1))',
      },
      animation: {
        'background-shine': 'background-shine 5s linear infinite',
        'gradient-move': 'gradient-move 10s ease infinite',
        'subtle-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'background-shine': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        'gradient-move': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      },
      boxShadow: {
        'cercooffro-soft': '0 10px 25px -5px rgba(94, 60, 209, 0.2)',
        'cercooffro-hover': '0 15px 30px -5px rgba(94, 60, 209, 0.3)',
      },
      borderRadius: {
        'cercooffro-lg': '1rem',
        'cercooffro-xl': '1.5rem',
      },
      spacing: {
        'cercooffro-gutter': '1.5rem',
      }
    },
  },
  plugins: [],
}

export default config;
