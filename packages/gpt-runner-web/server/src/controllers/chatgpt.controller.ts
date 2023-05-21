import type { Request, Response } from 'express'
import type { BaseChatMessage } from 'langchain/schema'
import { chatgptChain } from '../services'
import type { FailResponse, SuccessResponse } from '../utils/request'
import { buildFailResponse, buildSuccessResponse } from '../utils/request'
import { EnvConfig } from '../../../env-config'
import type { ControllerConfig } from './../types'

export interface ChatStreamReqParams {
  messages: BaseChatMessage[]
  prompt: string
  openaiKey?: string
  systemPrompt?: string
  temperature?: number
}
export const chatgptControllers: ControllerConfig = {
  namespacePath: '/chatgpt',
  controllers: [
    {
      url: '/chat-stream',
      method: 'post',
      handler: async (req: Request, res: Response) => {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
        })

        const { messages, prompt, systemPrompt, openaiKey, temperature = 0.7 } = req.body as ChatStreamReqParams

        const sendSuccessData = (options: Omit<SuccessResponse, 'type'>) => {
          return res.write(`data: ${JSON.stringify(buildSuccessResponse(options))}\n\n`)
        }

        const sendFailData = (options: Omit<FailResponse, 'type'>) => {
          return res.write(`data: ${JSON.stringify(buildFailResponse(options))}\n\n`)
        }

        const chain = await chatgptChain({
          messages,
          systemPrompt,
          temperature,
          openaiKey: openaiKey ?? EnvConfig.get('OPENAI_KEY'),
          onTokenStream: (token: string) => {
            sendSuccessData({ data: token })
          },
          onError: (err) => {
            sendFailData({ message: err.message })
          },
        })

        try {
          await chain.call({
            input: prompt,
          })
        }
        catch (error) {
          console.log('error', error)
        }
        finally {
          sendSuccessData({
            data: '[DONE]',
          })
          res.end()
        }
      },
    },
  ],

}
