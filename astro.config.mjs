// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import aws from "astro-sst";

// https://astro.build/config
export default defineConfig({
  output: "static",
  adapter: aws(),
  vite: {
    plugins: [tailwindcss()],
  },
});
