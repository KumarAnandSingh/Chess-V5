import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022', // Support BigInt and other modern features
  },
  esbuild: {
    target: 'es2022', // Ensure esbuild also uses modern target
  },
})
