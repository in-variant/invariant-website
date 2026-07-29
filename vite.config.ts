import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    // Local stand-in for the Vercel function: node scripts/dev-api.mjs
    proxy: {
      '/api': 'http://localhost:8788',
    },
  },
})
