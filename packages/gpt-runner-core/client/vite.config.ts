import path from 'node:path'
import { defineConfig } from 'vite'
import React from '@vitejs/plugin-react'

const resolvePath = (...paths: string[]) => path.resolve(__dirname, ...paths)

// https://vitejs.dev/config/
export default defineConfig({
  root: resolvePath('./'),
  publicDir: resolvePath('./public'),
  plugins: [
    React(),
  ],
  server: {
    port: 3006,
    host: true,
  },
})
