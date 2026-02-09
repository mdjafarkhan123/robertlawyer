import { defineConfig } from "astro/config";
import yaml from "@rollup/plugin-yaml";

export default defineConfig({
    vite: {
        plugins: [yaml()],
        build: {
            cssCodeSplit: true,
        },
        css: {
            preprocessorOptions: {
                scss: {
                    // This tells Sass it can look in these folders automatically
                    loadPaths: ["./src/styles"],
                },
            },
        },
    },
});
