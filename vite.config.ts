import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  base: '/static/reminders/', 
  build: {
    outDir: 'dist', 
    assetsDir: 'assets', 
  }
})
