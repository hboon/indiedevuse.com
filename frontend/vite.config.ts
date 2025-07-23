import { fileURLToPath, URL } from "node:url"

import prerender from "@prerenderer/rollup-plugin"
import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"

import { getPrerenderRoutes } from "./prerenderRoutes"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5176,
  },
  plugins: [
    vue(),
    prerender({
      routes: getPrerenderRoutes(),
      renderer: "@prerenderer/renderer-puppeteer",
      rendererOptions: {
        renderAfterDocumentEvent: "custom-render-trigger",
      },
      postProcess(renderedRoute) {
        renderedRoute.html = renderedRoute.html
          .replace(/http:/gi, "https:")
          .replace(/(https:\/\/)?(localhost|127\.0\.0\.1):\d*/gi, "https://indiedevuse.com" || "")
        let name: string
        if (renderedRoute.originalRoute === "/") {
          name = "root"
        } else {
          name = removePrefix(renderedRoute.originalRoute, "/").replace("/", "-")
        }
        renderedRoute.outputPath = `index-${name}.html`
        console.log(
          "Pre-render %o to dist/%o",
          renderedRoute.originalRoute,
          renderedRoute.outputPath
        )
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})

function removePrefix(str: string, prefix: string) {
  if (str.startsWith(prefix)) {
    return str.slice(prefix.length)
  }
  return str
}
