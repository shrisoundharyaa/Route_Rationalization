import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env, // Access environment variables
  },
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // Set '@' as alias for 'src'
    },
  },
  server: {
    host: '127.0.0.1',       // Force IPv4 localhost
    port: 3000,              // Use port 3000 for development
    strictPort: true,        // Exit if port 3000 is unavailable
    proxy: {
      '/api': {              // Proxy API requests starting with '/api'
        target: 'http://127.0.0.1:5000', // Flask backend address
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove '/api' prefix before sending to backend
      },
    },
  },
});
