import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev
export default defineConfig({
  plugins: [react()],
  base: '/static/', 
  // 🎯 THE FIX: Forcefully override the environment fallback path with a clean relative URL
  define: {
    'process.env.VITE_BACKEND_BASE_API': JSON.stringify('/api/v1'),
    'import.meta.env.VITE_BACKEND_BASE_API': JSON.stringify('/api/v1')
  }
})
