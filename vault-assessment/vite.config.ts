import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// SINGLEFILE=1 inlines all JS/CSS into one HTML (used for the shareable preview).
export default defineConfig({
  plugins: process.env.SINGLEFILE ? [react(), viteSingleFile()] : [react()],
  base: './',
})
