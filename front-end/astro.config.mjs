import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import path from 'path';

export default defineConfig({
  site: 'https://steelmat.com.ar',
  integrations: [sitemap()],
  output: 'server',
  adapter: vercel({
    imageService: true, // Habilitar Vercel Image Optimization
    isReserializable: true,
  }),
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },

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