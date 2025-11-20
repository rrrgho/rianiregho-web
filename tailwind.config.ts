import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      screens: {
        // Custom breakpoint for 1366x1024 (13-inch laptops)
        "1366": "1360px",
      },
    },
  },
};

export default config;
