import path from 'node:path'
import { defineConfig } from 'vite'
import React from '@vitejs/plugin-react'
import { EnvConfig } from '@nicepkg/gpt-runner-shared/common'
import { PathUtils } from '@nicepkg/gpt-runner-shared/node'

const __dirname = PathUtils.getCurrentDirName(import.meta.url)

const resolvePath = (...paths: string[]) => path.resolve(__dirname, ...paths)

// https://vitejs.dev/config/
export default defineConfig({
  root: resolvePath('./'),
  publicDir: resolvePath('./public'),
  optimizeDeps: {
    include: ['@nicepkg/gpt-runner-shared'],
  },
  plugins: [
    React(),
  ],
  build: {
    outDir: resolvePath('../dist/browser'),
  },
  server: {
    port: 3006,
    host: true,
    proxy: {
      '/api': {
        target: EnvConfig.get('GPTR_BASE_SERVER_URL'),
        changeOrigin: true,
      },
    },
  },
})
