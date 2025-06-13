// vite.config.mjs
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// ----------------------------------------------------------------------

export default defineConfig({
  plugins: [
    react(),
    jsconfigPaths(),
    nodePolyfills({
      include: ['stream', 'crypto', 'util', 'buffer'],
      exclude: ['http'], // AWS SDK needs native http in browser
      globals: {
        Buffer: true,
        global: true,
        process: true
      }
    })
  ],
  base: process.env.VITE_APP_BASE_NAME,
  define: {
    global: 'window',
    'process.env': process.env
  },
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1')
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1')
      },
      {
        find: 'aws-sdk',
        replacement: path.resolve(__dirname, 'node_modules/aws-sdk/dist/aws-sdk.js')
      }
    ]
  },
  optimizeDeps: {
    include: ['aws-sdk', 'buffer'],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/, /aws-sdk/],
      transformMixedEsModules: true
    }
  },
  server: {
    open: true,
    port: 3000
  },
  preview: {
    open: true,
    port: 3000
  }
});
