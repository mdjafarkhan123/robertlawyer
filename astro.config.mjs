import { defineConfig } from "astro/config";
import yaml from "@rollup/plugin-yaml";

export default defineConfig({
    vite: {
        plugins: [yaml()],
        build: {
            cssCodeSplit: true, // Creates separate CSS files per import
        },
    },
});
