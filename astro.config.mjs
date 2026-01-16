import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: "server",  // <-- THIS ENABLES POST REQUESTS
  vite: {
    plugins: [tailwindcss()],
  },
});
