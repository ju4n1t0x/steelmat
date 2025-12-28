import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import path from 'path';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  
  vite: {
    server: {
      allowedHosts: [
        '3c2388c08f35.ngrok-free.app'
      ]
    },
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
    plugins: [tailwindcss()],
  },
});