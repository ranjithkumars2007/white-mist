import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { enterpriseDevApiPlugin } from './vite-dev-middleware.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), enterpriseDevApiPlugin()],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
