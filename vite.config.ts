import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import Components from "unplugin-vue-components/vite"
import {
  AntDesignVueResolver,
  ElementPlusResolver,
  VantResolver
} from "unplugin-vue-components/resolvers"
Components({
  resolvers: [AntDesignVueResolver(), ElementPlusResolver(), VantResolver()]
} as any)
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      process: "process/browser"
    }
  }
})
