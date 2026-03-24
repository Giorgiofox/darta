import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Set base to '/darta/' if deploying to GitHub Pages at username.github.io/darta/
  // Set base to '/' if deploying to a root domain (darta-framework.org)
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
