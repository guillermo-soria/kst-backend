import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores principales basados en el logo
        'kst-lime': '#00FF00',     // Verde ácido del logo
        'kst-magenta': '#FF00FF',  // Magenta del logo
        'kst-pink': '#FF1493',     // Rosa vibrante
        'kst-cyan': '#00FFFF',     // Cyan complementario
        
        // Variaciones para diferentes estados
        primary: {
          50: '#f0fff0',
          100: '#dcffdc',
          200: '#bbffbb',
          300: '#86ff86',
          400: '#4aff4a',
          500: '#00FF00',   // kst-lime principal
          600: '#00e600',
          700: '#00b300',
          800: '#008000',
          900: '#006600',
          950: '#003300',
        },
        
        secondary: {
          50: '#fff0ff',
          100: '#ffddff',
          200: '#ffbbff',
          300: '#ff88ff',
          400: '#ff44ff',
          500: '#FF00FF',   // kst-magenta principal
          600: '#e600e6',
          700: '#cc00cc',
          800: '#990099',
          900: '#660066',
          950: '#330033',
        },
        
        accent: {
          50: '#fff5f8',
          100: '#ffe8ee',
          200: '#ffd1dc',
          300: '#ffaab9',
          400: '#ff7390',
          500: '#FF1493',   // kst-pink principal
          600: '#e6127a',
          700: '#cc1068',
          800: '#b30e56',
          900: '#800a3d',
          950: '#4d0626',
        },
        
        // Colores oscuros para el fondo y contraste
        dark: {
          50: '#1a1a1a',
          100: '#2d2d2d',
          200: '#404040',
          300: '#525252',
          400: '#666666',
          500: '#808080',
          600: '#999999',
          700: '#b3b3b3',
          800: '#cccccc',
          900: '#e6e6e6',
          950: '#f3f3f3',
        }
      },
      
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      
      boxShadow: {
        'neon-lime': '0 0 20px rgba(0, 255, 0, 0.5)',
        'neon-magenta': '0 0 20px rgba(255, 0, 255, 0.5)',
        'neon-pink': '0 0 20px rgba(255, 20, 147, 0.5)',
      },
      
      textShadow: {
        'lg': '2px 2px 4px rgba(0, 0, 0, 0.8)',
        'neon-lime': '0 0 10px rgba(0, 255, 0, 0.8), 0 0 20px rgba(0, 255, 0, 0.5)',
        'neon-magenta': '0 0 10px rgba(255, 0, 255, 0.8), 0 0 20px rgba(255, 0, 255, 0.5)',
      },
      
      animation: {
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite alternate',
        'gradient': 'gradient 6s ease infinite',
      },
      
      keyframes: {
        'neon-pulse': {
          '0%': { 
            boxShadow: '0 0 20px rgba(0, 255, 0, 0.8), 0 0 40px rgba(255, 0, 255, 0.6)' 
          },
          '100%': { 
            boxShadow: '0 0 10px rgba(0, 255, 0, 0.4), 0 0 20px rgba(255, 0, 255, 0.3)' 
          },
        },
        'gradient': {
          '0%, 100%': { 
            backgroundPosition: '0% 50%' 
          },
          '50%': { 
            backgroundPosition: '100% 50%' 
          },
        },
      },
      
      backgroundImage: {
        'gradient-neon': 'linear-gradient(45deg, #00FF00, #FF00FF, #FF1493)',
        'gradient-dark-neon': 'linear-gradient(135deg, #1a1a1a, #2d2d2d, #1a1a1a)',
      }
    },
  },
  plugins: [
    function({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        '.text-shadow-lg': {
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
        },
        '.text-shadow-neon-lime': {
          textShadow: '0 0 10px rgba(0, 255, 0, 0.8), 0 0 20px rgba(0, 255, 0, 0.5)',
        },
        '.text-shadow-neon-magenta': {
          textShadow: '0 0 10px rgba(255, 0, 255, 0.8), 0 0 20px rgba(255, 0, 255, 0.5)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
} satisfies Config;
