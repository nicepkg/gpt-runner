import path from 'node:path'
import type { UserConfig } from 'vite'
import { defineConfig } from 'vite'
import React from '@vitejs/plugin-react'
import Svgr from 'vite-plugin-svgr'
import { EnvConfig } from '@nicepkg/gpt-runner-shared/common'
import { PathUtils } from '@nicepkg/gpt-runner-shared/node'
import { alias } from './../../../alias'
import { copyMonacoEditor } from './scripts/copy-monaco-editor'

const dirname = PathUtils.getCurrentDirName(import.meta.url, () => __dirname)

const resolvePath = (...paths: string[]) => path.resolve(dirname, ...paths)

// https://vitejs.dev/config/
export default defineConfig(async () => {
  await copyMonacoEditor()

  return {
    root: resolvePath('./'),
    publicDir: resolvePath('./public'),
    optimizeDeps: {
      include: ['@nicepkg/gpt-runner-shared'],
    },
    plugins: [
      React(),
      Svgr(),
    ],
    build: {
      outDir: resolvePath('../dist/browser'),
    },
    resolve: {
      alias: {
        ...alias,
      },
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
  } satisfies UserConfig
})
