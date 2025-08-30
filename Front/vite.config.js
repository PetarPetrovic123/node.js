import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        // If your backend does NOT prefix routes with /api,
        // uncomment the next line to strip it:
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
