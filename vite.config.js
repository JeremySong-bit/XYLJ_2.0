import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cesium from "vite-plugin-cesium"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), cesium()],
  resolve: {
    alias: {
        '@': fileURLToPath(new URL('./src/purchase/src', import.meta.url))
    },
    extensions: [
        '.js',
        '.json',
        '.jsx',
        '.mjs',
        '.ts',
        '.tsx',
        '.vue',
    ],
},
server: {
    port: 5173,
    proxy: {
        '/api': {
            target: 'http://localhost:8082',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
        },
    }
},

})
