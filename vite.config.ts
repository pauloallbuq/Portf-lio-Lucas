import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// BASE_PATH: '/' (padrão), '/portfolio/' no GitHub Pages ou './' para hospedagem relativa
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
})
