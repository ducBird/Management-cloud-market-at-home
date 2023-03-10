/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#005745",
        communicate: "#f6f4f2",
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      //css child elements
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
    },
  ],
  corePlugins: {
    preflight: false, // <== disable transparent this!
  },
  // content: ['./pages/**/*.{html,js}', './components/**/*.{html,js}'],
};
