import { defineConfig } from '@nicepkg/gpt-runner'

export default defineConfig({
  model: {
    type: 'openai',
    modelName: 'gpt-3.5-turbo-16k',
    secrets: {
      apiKey: process.env.OPENAI_KEY!,
    },
  },
})
