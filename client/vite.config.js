import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { createServer } from 'http';

const env = loadEnv('all', process.cwd());
const productionUrl = env.VITE_PRODUCTION_URL || "http://localhost:3001";

// Function to set allowed methods
function allowMethods(req, res, next) {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
}

export default defineConfig({
  server: {
    proxy: {
      "/association-funds": {
        target: productionUrl,
        middleware: allowMethods
      }
    },
  },
  plugins: [
    react(),
  ],
});