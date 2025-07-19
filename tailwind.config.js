module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#E6EEFF',
          100: '#B3CCFF',
          200: '#80AAFF',
          300: '#4D88FF',
          400: '#1A66FF',
          500: '#2563eb',
          600: '#2952A3',
          700: '#1F3D7A',
          800: '#142952',
          900: '#0A1429',
        },
        navy: '#1e293b',
        sky: '#38bdf8',
        slate: '#64748b',
        lilac: '#f1f5f9',
        white: '#ffffff',
        success: '#22C55E',
        warning: '#FACC15',
        error: '#EF4444',
        text: {
          primary: '#1e293b',
          secondary: '#64748b',
          placeholder: '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}; 