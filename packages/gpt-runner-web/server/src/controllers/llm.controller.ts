import type { Request, Response } from 'express'
import type { ChatStreamReqParams, FailResponse, SuccessResponse } from '@nicepkg/gpt-runner-shared/common'
import { ChatStreamReqParamsSchema, Debug, STREAM_DONE_FLAG, buildFailResponse, buildSuccessResponse } from '@nicepkg/gpt-runner-shared/common'
import { verifyParamsByZod } from '@nicepkg/gpt-runner-shared/node'
import { getLLMChain } from '@nicepkg/gpt-runner-core'
import type { ControllerConfig } from '../types'
import { LLMService } from '../services/llm.service'

export const llmControllers: ControllerConfig = {
  namespacePath: '/chatgpt',
  controllers: [
    {
      url: '/chat-stream',
      method: 'post',
      handler: async (req: Request, res: Response) => {
        const debug = new Debug('llm.controller')

        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
        })

        const body = req.body as ChatStreamReqParams

        verifyParamsByZod(body, ChatStreamReqParamsSchema)

        const {
          prompt = '',
        } = body

        const llmChainParams = await LLMService.getLLMChainParams(body)

        const sendSuccessData = (options: Omit<SuccessResponse, 'type'>) => {
          return res.write(`data: ${JSON.stringify(buildSuccessResponse(options))}\n\n`)
        }

        const sendFailData = (options: Omit<FailResponse, 'type'>) => {
          options.data = `Server Error: ${options.data}`
          return res.write(`data: ${JSON.stringify(buildFailResponse(options))}\n\n`)
        }

        debug.log('model config', llmChainParams.model)

        try {
          const llmChain = await getLLMChain({
            ...llmChainParams,
            onTokenStream: (token: string) => {
              sendSuccessData({ data: token })
            },
            onError: (err) => {
              sendFailData({ data: err.message })
            },
          })

          await llmChain.call({
            'global.input': prompt,
          })

          // const structDataChain = await getStructDataChain({
          //   model: {
          //     ...model!,
          //     secrets: finalSecrets,
          //   },
          // })

          // const structDataChainAnswer = await structDataChain.call({
          //   input: answer,
          // })

          // console.log('structDataChainAnswer', structDataChainAnswer)
        }
        catch (error: any) {
          console.log('chatgptChain error', error)
          sendFailData({ data: String(error?.message || error) })
        }
        finally {
          sendSuccessData({
            data: STREAM_DONE_FLAG,
          })
          res.end()
        }
      },
    },
  ],

}
