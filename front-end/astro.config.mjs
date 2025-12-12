import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    server: {
       allowedHosts: [
      'a9141ec9e17c.ngrok-free.app'
      // Puedes agregar más hosts si lo necesitas
    ]
    },
    plugins: [tailwindcss()],
  },
})