import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // GitHub Pages user site is served at the domain root.
  base: '/',
  plugins: [react(), tailwindcss()],
})
