import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  vite: {
    server: {
       allowedHosts: [
      '3c2388c08f35.ngrok-free.app'
      // Puedes agregar más hosts si lo necesitas
    ]
    },
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
    plugins: [tailwindcss()],
  },
})