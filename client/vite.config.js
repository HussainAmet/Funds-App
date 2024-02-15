import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from "dotenv";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/association-funds" : process.env.PRODUCTION_URL || "http://localhost:3001",
    },
  },
  plugins: [
    react(),
    dotenv.config(),
  ],
})