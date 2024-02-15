import { defineConfig, loadEnv  } from 'vite'
import react from '@vitejs/plugin-react'

const env = loadEnv(
    'all',
    process.cwd()
);

let productionUrl = env.VITE_PRODUCTION_URL;

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/association-funds" : productionUrl || "http://localhost:3001",
    },
  },
  plugins: [
    react(),
  ],
})