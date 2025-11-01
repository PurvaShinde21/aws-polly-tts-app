import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Dark mode colors
        'bg-dark': 'hsl(0, 0%, 0%)',
        'bg': 'hsl(0, 0%, 5%)',
        'bg-light': 'hsl(0, 0%, 10%)',
        'text': 'hsl(0, 0%, 95%)',
        'text-muted': 'hsl(0, 0%, 70%)',
        
        // Light mode colors (using data attributes)
        'bg-dark-light': 'hsl(0, 0%, 90%)',
        'bg-main-light': 'hsl(0, 0%, 95%)',
        'bg-light-light': 'hsl(0, 0%, 100%)',
        'text-light': 'hsl(0, 0%, 5%)',
        'text-muted-light': 'hsl(0, 0%, 30%)',
      },
    },
  },
  plugins: [],
};

export default config;
