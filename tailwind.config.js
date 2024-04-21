/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    colors: {
      transparent: "transparent",
      marineBlue: "hsl(213, 96%, 18%)",
      purplishBlue: "hsl(243, 100%, 62%)",
      pastelBlue: "hsl(228, 100%, 84%)",
      lightBlue: "hsl(206, 94%, 87%)",
      strawberryRed: "hsl(354, 84%, 57%)",

      coolGray: "hsl(231, 11%, 63%)",
      lightGray: "hsl(229, 24%, 87%)",
      magnolia: "hsl(217, 100%, 97%)",
      alabaster: "hsl(231, 100%, 99%)",
      white: "hsl(0, 0%, 100%)",
    },
    container: {
      center: false,
    },

    fontFamily: {
      ubuntu: ["Ubuntu", "sans-serif"],
      sans: ["Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
    extend: {
      backgroundImage: {
        "sidebar-desktop": "url('/src/images/bg-sidebar-desktop.svg')",
        "sidebar-mobile": "url('/src/images/bg-sidebar-mobile.svg')",
      },
    },
  },
  plugins: [],
};
