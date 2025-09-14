import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    server: {
       allowedHosts: [
      '8b9e2a0fd388.ngrok-free.app'
      // Puedes agregar más hosts si lo necesitas
    ]
    },
    plugins: [tailwindcss()],
  },
})