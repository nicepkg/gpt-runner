import { defineConfig } from '@nicepkg/gpt-runner'

export default defineConfig({
  model: {
    type: 'openai',
    modelName: 'gpt-3.5.turbo2',
    openaiKey: process.env.OPENAI_KEY!,
  },
})
