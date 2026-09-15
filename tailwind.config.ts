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
        studio: {
          canvas: "#F0EFED",
          backdrop: "#E4E3E0",
          surface: "#FFFFFF",
          slate: "#2A3138",
          ink: "#15171A",
          secondary: "#6B7076",
          tertiary: "#9AA0A6",
          divider: "#D5D5D2",
          subtle: "#EAEAE7",
          track: "#F1F1EF",
          sage: "#6E8F82",
        },
        anatomy: {
          skin: "#E3C3AC",
          muscle: "#BE6E5C",
          bone: "#E6DFCD",
          xray: "#D5D5D2",
        },
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(20,22,26,0.10)",
        card: "0 4px 24px rgba(20,22,26,0.06), 0 1px 2px rgba(20,22,26,0.04)",
        modal: "0 18px 48px rgba(20,22,26,0.12), 0 1px 2px rgba(20,22,26,0.04)",
        ring: "inset 0 0 0 1.5px #2A3138",
      },
      borderRadius: {
        'card': '24px',
        'chip': '10px',
        'segmented': '12px',
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
