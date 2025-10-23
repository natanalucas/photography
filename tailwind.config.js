/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
      extend: {
        keyframes: {
          fadeIn: {
            "0%": { opacity: 0, transform: "translateY(20px)" },
            "100%": { opacity: 1, transform: "translateY(0)" },
          },
        },
        animation: {
          fadeIn: "fadeIn 0.8s ease-out forwards",
        },
        // Move the `colors` property here
        colors: {
          "my-blue": "#05a4fb",
          "my-pink": "#ec4899",
        },
      },
    },
    plugins: [],
  };