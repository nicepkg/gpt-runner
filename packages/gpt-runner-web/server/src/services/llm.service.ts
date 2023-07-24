import { ChatModelType, type ChatStreamReqParams, type SingleFileConfig, toUnixPath } from '@nicepkg/gpt-runner-shared/common'
import type { LLMChainParams } from '@nicepkg/gpt-runner-core'
import { createFileContext, getSecrets, loadUserConfig, parseGptFile } from '@nicepkg/gpt-runner-core'
import { PathUtils } from '@nicepkg/gpt-runner-shared/node'
import { getValidFinalPath } from '../helpers/valid-path'
import { AppConfigService } from './app-config.service'

export class LLMService {
  static async getLLMChainParams(params: ChatStreamReqParams): Promise<LLMChainParams> {
    const {
      messages = [],
      systemPrompt: systemPromptFromParams = '',
      singleFilePath,
      singleFileConfig: singleFileConfigFromParams,
      appendSystemPrompt = '',
      systemPromptAsUserPrompt = false,
      contextFilePaths,
      editingFilePath,
      overrideModelType,
      modelTypeVendorNameMap,
      overrideModelsConfig,
      rootPath,
    } = params

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
      type: ChatModelType.Openai,
      ...singleFileConfig?.model,
      ...overrideModelsConfig?.[singleFileConfig?.model?.type as ChatModelType || ''],
    } as SingleFileConfig['model']

    const secretFromUserConfig = userConfig.model?.type === model?.type ? userConfig.model?.secrets : undefined
    let secretsFromStorage = await getSecrets(model?.type as ChatModelType || null)
    // if some secret value is '' or null or undefined, should remove
    secretsFromStorage = Object.fromEntries(Object.entries(secretsFromStorage || {}).filter(([_, value]) => value != null && value !== '' && value !== undefined))

    // if user use vendor secrets
    const currentVendorName = modelTypeVendorNameMap?.[model!.type] || ''
    const vendorSecrets = await AppConfigService.instance.getSecretsConfig({
      modelType: model!.type,
      vendorName: currentVendorName,
    })

    const finalSecrets = vendorSecrets || {
      ...secretFromUserConfig,
      ...secretsFromStorage,
    }

    const finalSystemPrompt = await LLMService.getFinalSystemPrompt({
      finalPath,
      systemPrompt: systemPromptFromParams,
      singleFileConfig,
      appendSystemPrompt,
      contextFilePaths,
      editingFilePath,
    })

    return {
      messages,
      systemPrompt: finalSystemPrompt,
      systemPromptAsUserPrompt,
      model: {
        ...model!,
        secrets: finalSecrets,
      },
    }
  }

  static async getFinalSystemPrompt(params: {
    finalPath: string
    systemPrompt: string
    singleFileConfig?: SingleFileConfig
    appendSystemPrompt: string
    contextFilePaths?: string[]
    editingFilePath?: string
  }): Promise<string> {
    const {
      finalPath,
      systemPrompt: systemPromptFromParams = '',
      singleFileConfig,
      appendSystemPrompt = '',
      contextFilePaths,
      editingFilePath,
    } = params

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
    return finalSystemPrompt
  }
}
