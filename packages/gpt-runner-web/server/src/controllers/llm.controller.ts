import type { Request, Response } from 'express'
import type { ChatModelType, ChatStreamReqParams, FailResponse, SingleFileConfig, SuccessResponse } from '@nicepkg/gpt-runner-shared/common'
import { ChatStreamReqParamsSchema, Debug, STREAM_DONE_FLAG, buildFailResponse, buildSuccessResponse, toUnixPath } from '@nicepkg/gpt-runner-shared/common'
import { PathUtils, verifyParamsByZod } from '@nicepkg/gpt-runner-shared/node'
import { createFileContext, getSecrets, llmChain, loadUserConfig, parseGptFile } from '@nicepkg/gpt-runner-core'
import { getValidFinalPath } from '../services/valid-path'
import type { ControllerConfig } from '../types'

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
          messages = [],
          prompt = '',
          systemPrompt: systemPromptFromParams = '',
          singleFilePath,
          singleFileConfig: singleFileConfigFromParams,
          appendSystemPrompt = '',
          contextFilePaths,
          editingFilePath,
          overrideModelType,
          overrideModelsConfig,
          rootPath,
        } = body

        const finalPath = getValidFinalPath({
          path: rootPath,
          assertType: 'directory',
          fieldName: 'rootPath',
        })

        const { config: userConfig } = await loadUserConfig(finalPath)

        let singleFileConfig: SingleFileConfig | undefined = singleFileConfigFromParams

        if (singleFilePath && PathUtils.isFile(singleFilePath)) {
          // keep realtime config
          singleFileConfig = await parseGptFile({
            filePath: singleFilePath,
            userConfig,
          })
        }

        if (overrideModelType && overrideModelType !== singleFileConfig?.model?.type) {
          singleFileConfig = {
            model: {
              type: overrideModelType,
            },
          }
        }

        const model = {
          ...singleFileConfig?.model,
          ...overrideModelsConfig?.[singleFileConfig?.model?.type as ChatModelType || ''],
        } as SingleFileConfig['model']

        const secretFromUserConfig = userConfig.model?.type === model?.type ? userConfig.model?.secrets : undefined
        let secretsFromStorage = await getSecrets(model?.type as ChatModelType || null)
        // if some secret value is '' or null or undefined, should remove
        secretsFromStorage = Object.fromEntries(Object.entries(secretsFromStorage || {}).filter(([_, value]) => value != null && value !== '' && value !== undefined))

        const finalSecrets = {
          ...secretFromUserConfig,
          ...secretsFromStorage,
        }

        const sendSuccessData = (options: Omit<SuccessResponse, 'type'>) => {
          return res.write(`data: ${JSON.stringify(buildSuccessResponse(options))}\n\n`)
        }

        const sendFailData = (options: Omit<FailResponse, 'type'>) => {
          options.data = `Server Error: ${options.data}`
          return res.write(`data: ${JSON.stringify(buildFailResponse(options))}\n\n`)
        }

        debug.log('model config', model)

        try {
          let finalSystemPrompt = systemPromptFromParams || singleFileConfig?.systemPrompt || ''

          // provide file context
          if (contextFilePaths && finalPath) {
            const fileContext = await createFileContext({
              rootPath: finalPath,
              filePaths: contextFilePaths?.map(toUnixPath),
              editingFilePath: toUnixPath(editingFilePath),
            })

            finalSystemPrompt += `\n${fileContext}\n`
          }

          finalSystemPrompt += appendSystemPrompt

          const chain = await llmChain({
            messages,
            systemPrompt: finalSystemPrompt,
            model: {
              ...model!,
              secrets: finalSecrets,
            },
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
            data: STREAM_DONE_FLAG,
          })
          res.end()
        }
      },
    },
  ],

}
