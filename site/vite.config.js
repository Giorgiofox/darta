import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Injected only on build: the dev server needs inline scripts (react-refresh
// preamble) that this policy would block.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

function injectCsp() {
  return {
    name: 'inject-csp',
    apply: 'build',
    transformIndexHtml() {
      return [
        {
          tag: 'meta',
          attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP },
          injectTo: 'head-prepend',
        },
      ];
    },
  };
}

export default defineConfig({
  plugins: [react(), injectCsp()],
  // Set base to '/darta/' if deploying to GitHub Pages at username.github.io/darta/
  // Set base to '/' if deploying to a root domain (darta-framework.org)
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
