import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a56db",
        "primary-dark": "#1544b0",
        dark: "#111827",
        "gray-text": "#6b7280",
        "gray-light": "#f3f4f6",
        "gray-border": "#e5e7eb",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "680px",
        "content-wide": "780px",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "680px",
            lineHeight: "1.85",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
