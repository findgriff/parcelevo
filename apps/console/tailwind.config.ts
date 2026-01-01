import type { Config } from 'tailwindcss';

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Fraunces'", 'serif'],
        sans: ["'Space Grotesk'", 'sans-serif'],
      },
      colors: {
        ink: "#0b0b0c",
        sand: "#f6f0e6",
        petrol: "#1f5b5f",
        ember: "#e35b3d",
        moss: "#2f6b4f",
      },
      boxShadow: {
        card: "0 20px 60px rgba(10, 10, 10, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
