import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Allow overriding base path (useful for GitHub Pages project paths)
  // e.g., BASE_PATH=/Ai_Mock_Interviews/
  base: process.env.BASE_PATH || '/',
})
