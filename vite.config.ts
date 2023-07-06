import { defineConfig } from "vite";

export default defineConfig({
    base: "/text_flow_field/",
    build: {
        modulePreload: {
            polyfill: false
        },
        rollupOptions: {
            output: {
                entryFileNames: "[name].js",
                chunkFileNames: "[name].js",
                assetFileNames: "[name].[ext]"
            }
        }
    }
})