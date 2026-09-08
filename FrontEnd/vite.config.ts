import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
     svgr({
        svgrOptions: {
          exportType: 'default',
        },
      }),
  ],
  resolve: {
    alias: {
      '@': `${import.meta.dirname}/src/`,
      '@assets': `${import.meta.dirname}/src/assets/`,
      '@utils': `${import.meta.dirname}/src/utils/`,
      '@authforge/shared': `${import.meta.dirname}/../packages/shared/src/index.ts`,
    },
  },
})
