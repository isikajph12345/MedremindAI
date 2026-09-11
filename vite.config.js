import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'], // remove/add entries to match what's actually in your public/ folder
      manifest: {
        name: 'Medremind AI',
        short_name: 'Medremind',
        description: 'Your Medicine. Your Routine. Your Companion.',
        theme_color: '#5B3E8C',
        background_color: '#FAF9F7',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/.favicon.ico',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/.favicon.ico',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})