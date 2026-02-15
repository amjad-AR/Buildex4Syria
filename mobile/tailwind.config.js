/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#022d37',
        accent: '#084C5C',
        beige: '#ffedd8',
      },
      fontFamily: {
        'space-grotesk': ['SpaceGrotesk-Bold'],
        'manrope': ['Manrope-Regular'],
        'manrope-medium': ['Manrope-Medium'],
        'manrope-semibold': ['Manrope-SemiBold'],
        'jetbrains': ['JetBrainsMono-Medium'],
      },
    },
  },
  plugins: [],
};
