import type { Request, Response } from 'express'
import type { ChatStreamReqParams } from '@nicepkg/gpt-runner-shared/common'
import { EnvConfig } from '@nicepkg/gpt-runner-shared/common'
import type { FailResponse, SuccessResponse } from '@nicepkg/gpt-runner-shared/node'
import { buildFailResponse, buildSuccessResponse, sendSuccessResponse } from '@nicepkg/gpt-runner-shared/node'
import { chatgptChain } from '../services'
import type { ControllerConfig } from './../types'

export const chatgptControllers: ControllerConfig = {
  namespacePath: '/chatgpt',
  controllers: [
    {
      url: '/health',
      method: 'get',
      handler: async (req: Request, res: Response) => {
        sendSuccessResponse(res, {
          data: 'ok',
        })
      },
    },
    {
      url: '/chat-stream',
      method: 'post',
      handler: async (req: Request, res: Response) => {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
        })

        const {
          messages = [],
          prompt = '',
          systemPrompt = '',
          openaiKey = process.env.OPENAI_API_KEY,
          temperature = 0.7,
        } = req.body as ChatStreamReqParams

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
          console.log('chatgptChain error', error)
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
