import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { openweatherProxy } from './vite-plugin-openweather-proxy';

const weatherGovHeaders = {
  'User-Agent': 'CreativeCorvid/1.0 (https://creativecorvid.com)',
};

const weatherGovProxy = {
  target: 'https://api.weather.gov',
  changeOrigin: true,
  rewrite: (path: string) => path.replace(/^\/api\/weather-gov/, ''),
  headers: weatherGovHeaders,
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), openweatherProxy()],
  server: {
    proxy: {
      '/api/weather-gov': weatherGovProxy,
    },
  },
  preview: {
    proxy: {
      '/api/weather-gov': weatherGovProxy,
    },
  },
});
