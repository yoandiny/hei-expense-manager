// tailwind.config.js
import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  dark: "class", // active le dark mode via la classe .dark
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // adapte selon ton projet
  ],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("dark", ".dark &"); 
      // Exemple : <div class="dark-mode:bg-red-500">
    }),
  ],
};
