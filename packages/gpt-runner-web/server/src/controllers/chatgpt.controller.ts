import type { Request, Response } from 'express'
import type { ChatStreamReqParams } from '@nicepkg/gpt-runner-shared/common'
import { ChatStreamReqParamsSchema, EnvConfig } from '@nicepkg/gpt-runner-shared/common'
import type { FailResponse, SuccessResponse } from '@nicepkg/gpt-runner-shared/node'
import { buildFailResponse, buildSuccessResponse, sendSuccessResponse, verifyParamsByZod } from '@nicepkg/gpt-runner-shared/node'
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

        const body = req.body as ChatStreamReqParams

        verifyParamsByZod(body, ChatStreamReqParamsSchema)

        const {
          messages = [],
          prompt = '',
          systemPrompt = '',

          // OpenaiBaseConfig
          openaiKey = EnvConfig.get('OPENAI_KEY'),
          temperature = 0.7,
          maxTokens,
          topP,
          frequencyPenalty,
          presencePenalty,
        } = body

        const sendSuccessData = (options: Omit<SuccessResponse, 'type'>) => {
          return res.write(`data: ${JSON.stringify(buildSuccessResponse(options))}\n\n`)
        }

        const sendFailData = (options: Omit<FailResponse, 'type'>) => {
          options.data = `Server Error: ${options.data}`
          return res.write(`data: ${JSON.stringify(buildFailResponse(options))}\n\n`)
        }

        try {
          const chain = await chatgptChain({
            messages,
            systemPrompt,
            openaiKey,
            temperature,
            maxTokens,
            topP,
            frequencyPenalty,
            presencePenalty,
            onTokenStream: (token: string) => {
              sendSuccessData({ data: token })
            },
            onError: (err) => {
              sendFailData({ data: err.message })
            },
          })

          await chain.call({
            'global.input': prompt,
          })
        }
        catch (error: any) {
          console.log('chatgptChain error', error)
          sendFailData({ data: String(error?.message || error) })
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
