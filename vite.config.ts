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
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          additionalManifestEntries: [],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
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
      modulePreload: {
        resolveDependencies: (filename, deps, { hostId, hostType }) => {
          return deps.filter(dep => !dep.includes('markdown-libs') && !dep.includes('pdf-libs'));
        }
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (
                id.includes('react') ||
                id.includes('react-dom') ||
                id.includes('scheduler') ||
                id.includes('framer-motion') ||
                id.includes('motion') ||
                id.includes('zustand') ||
                id.includes('zundo') ||
                id.includes('react-router') ||
                id.includes('react-router-dom') ||
                id.includes('react-helmet-async') ||
                id.includes('lucide-react') ||
                id.includes('@radix-ui') ||
                id.includes('react-joyride')
              ) {
                return 'react-core';
              }
              if (
                id.includes('pdfjs-dist') ||
                id.includes('react-to-print') ||
                id.includes('jspdf') ||
                id.includes('html2canvas')
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
                id.includes('parse5') ||
                id.includes('remark') ||
                id.includes('rehype')
              ) {
                return 'markdown-libs';
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
