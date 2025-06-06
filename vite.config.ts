import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      srcDir: 'src',               // Carpeta donde estará tu SW personalizado
      filename: 'custom-sw.js',    // Nombre del archivo SW personalizado
      strategies: 'injectManifest',// Usar estrategia injectManifest
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest: {
        short_name: "ASANA | OTI",
        name: "ASANA | OTI",
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          { src: "/icons/icon-128x128.png", sizes: "128x128", type: "image/png" },
          { src: "/icons/icon-144x144.png", sizes: "144x144", type: "image/png" },
          { src: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
          { src: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-256x256.png", sizes: "256x256", type: "image/png" },
          { src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),
  ],
  optimizeDeps: {
    include: ['@fullcalendar/core', '@fullcalendar/daygrid', '@fullcalendar/interaction']
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})