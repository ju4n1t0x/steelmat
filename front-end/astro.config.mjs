import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    server: {
       allowedHosts: [
      '3c2388c08f35.ngrok-free.app'
      // Puedes agregar más hosts si lo necesitas
    ]
    },
    plugins: [tailwindcss()],
  },
})