import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.js'],
  },
  plugins: [
    vue(),
    // Removed viteDevTools to avoid version conflicts
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false, // or true if you want details
  }
})
