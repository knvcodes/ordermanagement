/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        secondary: '#004E89',
        accent: '#1A659E',
        success: '#2ECC71',
        warning: '#F1C40F',
        danger: '#E74C3C',
        dark: '#1A1A2E',
        light: '#F8F9FA',
      },
    },
  },
  plugins: [],
};
