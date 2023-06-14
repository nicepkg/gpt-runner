import { Openai } from '../openai'

interface AskGPTParams {
  systemPrompt: string
  userPrompt: string
  histories?: {
    role: 'assistant' | 'user'
    content: string
  }[]
  model?: string
  openaiKey: string
  maxTokens?: number
  temperature?: number
}

export class Api {
  static async askGPT({
    systemPrompt,
    userPrompt,
    openaiKey,
    histories = [],
    model = 'gpt-3.5-turbo-16k',
    maxTokens = 2000,
    temperature = 0,
  }: AskGPTParams) {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...histories,
      { role: 'user', content: userPrompt },
    ]

    const params = {
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
    }

    const response: any = await Openai.getCompletion(params, openaiKey)
    const reply: string = response.choices[0].message.content
    return reply
  }
}
