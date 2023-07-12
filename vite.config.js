import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import cesium from 'vite-plugin-cesium'

export default defineConfig({
  plugins: [solid(),cesium()],
})
