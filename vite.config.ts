import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Hash Resume',
          short_name: 'HashResume',
          description: 'A powerful app to build and optimize your resume.',
          theme_color: '#FF4D2D',
          background_color: '#001639',
          lang: 'ar',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}']
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (
                id.includes('react') ||
                id.includes('react-dom') ||
                id.includes('react-router') ||
                id.includes('react-router-dom') ||
                id.includes('react-helmet-async')
              ) {
                return 'react-core';
              }
              if (
                id.includes('pdfjs-dist') ||
                id.includes('react-to-print')
              ) {
                return 'pdf-libs';
              }
              if (id.includes('docx')) {
                return 'docx-libs';
              }
              if (
                id.includes('react-markdown') ||
                id.includes('micromark') ||
                id.includes('mdast') ||
                id.includes('unist') ||
                id.includes('vfile') ||
                id.includes('parse5')
              ) {
                return 'markdown-libs';
              }
              if (
                id.includes('lucide-react') ||
                id.includes('framer-motion') ||
                id.includes('motion') ||
                id.includes('react-joyride')
              ) {
                return 'ui-vendors';
              }
              if (
                id.includes('date-fns') ||
                id.includes('papaparse') ||
                id.includes('zundo') ||
                id.includes('zustand')
              ) {
                return 'utils';
              }
              return 'vendor-others';
            }
            if (id.includes('/components/editor/')) {
              return 'editor-components';
            }
            if (id.includes('/components/preview/')) {
              return 'preview-components';
            }
          }
        }
      }
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    test: {
      environment: 'jsdom',
    },
  };
});
