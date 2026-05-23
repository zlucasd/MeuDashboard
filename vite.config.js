import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Dashboard de Estudos',
        short_name: 'Estudos',
        description: 'Meu painel de estudos pessoal',
        theme_color: '#1a1650',
        background_color: '#0e1117',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/MeuDashboard/',
        scope: '/MeuDashboard/',
        icons: [
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
    }),
  ],
  base: '/MeuDashboard/',
})
