import { defineConfig } from "vite";
import Icons from "unplugin-icons/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/consentio/",
  plugins: [
    Icons({
      compiler: "raw", // Returns a clean SVG string or element context
      autoInstall: true,
    }),
    tailwindcss(),
  ],
});
