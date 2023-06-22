import path from 'node:path'
import { defineConfig } from '@nicepkg/gpt-runner'

export default defineConfig({
  rootPath: path.resolve(__dirname, '../'),
  model: {
    type: 'openai',
    modelName: 'gpt-3.5-turbo-16k-error',
    secrets: {
      apiKey: process.env.OPENAI_KEY!,
    },
  },
})
