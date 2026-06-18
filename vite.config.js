import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // 1. Adicione esta importação
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(), // 2. Adicione o plugin do Tailwind aqui de volta!
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg', 'pwa-192x192.png', 'pwa-512x512.png'],
            manifest: {
                name: 'Figurados Copa 2026',
                short_name: 'Figurados',
                description: 'Gerencie sua coleção de figurinhas da Copa do Mundo 2026',
                theme_color: '#1e3a8a',
                background_color: '#ffffff',
                display: 'standalone',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
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
});
