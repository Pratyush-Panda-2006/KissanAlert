/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Legacy colors (kept for backward compat)
        charcoal: "#141a16",
        offWhite: "#f0ede6",
        white: "#ffffff",
        coralRed: "#e63946",
        sage: "#a3b1ac",
        teal: "#2ec4b6",
        slate: "#2a3630",
        goldenYellow: "#ffe17c",
        charcoalDark: "#171e19",
        darkGray: "#272727",
        sageMuted: "#b7c6c2",
        // Kisan Alert — Water-themed palette
        ocean: "#0C4A6E",
        oceanLight: "#0E5A85",
        aqua: "#06B6D4",
        aquaLight: "#22D3EE",
        river: "#0EA5E9",
        earth: "#78350F",
        earthLight: "#92400E",
        harvest: "#F59E0B",
        harvestLight: "#FBBF24",
        leaf: "#16A34A",
        leafLight: "#22C55E",
        alert: "#DC2626",
        sky: "#E0F2FE",
        skyDark: "#0284C7",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Anton', 'sans-serif'],
        body: ['Satoshi', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.02em',
      },
      animation: {
        'ripple': 'ripple 2s ease-out infinite',
        'wave': 'wave 3s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'droplet': 'droplet 2.5s ease-in-out infinite',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(0) translateY(0)' },
          '25%': { transform: 'translateX(-5px) translateY(-3px)' },
          '75%': { transform: 'translateX(5px) translateY(3px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        droplet: {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '0.7' },
          '50%': { transform: 'translateY(-12px) scale(1.1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
