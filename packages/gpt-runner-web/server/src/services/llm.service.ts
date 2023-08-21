import { ChatModelType, DEFAULT_MODEL_NAMES_FOR_CHOOSE, toUnixPath } from '@nicepkg/gpt-runner-shared/common'
import type { AiPersonConfig, ChatStreamReqParams, GetModelNamesForChooseReqParams, GlobalAiPersonConfig, ModelTypeVendorNameMap } from '@nicepkg/gpt-runner-shared/common'
import type { LLMChainParams } from '@nicepkg/gpt-runner-core'
import { createFileContext, getSecrets, loadGlobalAiPersonConfig, parseAiPersonFile } from '@nicepkg/gpt-runner-core'
import { PathUtils } from '@nicepkg/gpt-runner-shared/node'
import { getValidFinalPath } from '../helpers/valid-path'
import { AppConfigService } from './app-config.service'

export class LLMService {
  static async getLLMModelsNames(params: GetModelNamesForChooseReqParams): Promise<string[]> {
    const { rootPath, modelType, modelTypeVendorNameMap } = params

    const finalPath = getValidFinalPath({
      path: rootPath,
      assertType: 'directory',
      fieldName: 'rootPath',
    })

    const { config: globalAiPersonConfig } = await loadGlobalAiPersonConfig(finalPath)

    const finalSecrets = await LLMService.getSecretsFormAllWays({
      modelType,
      globalAiPersonConfig,
      modelTypeVendorNameMap,
    })

    let result: string[] = []

    result = Object.entries(globalAiPersonConfig.urlConfig || {}).find(([urlMatcher]) => {
      // for example: urlMatcher maybe 'https://api.openai.com/*'
      return Boolean(finalSecrets.basePath?.match(urlMatcher))
    })?.[1]?.modelNames || []

    if (!result.length)
      return DEFAULT_MODEL_NAMES_FOR_CHOOSE[modelType]

    return result
  }

  static async getLLMChainParams(params: ChatStreamReqParams): Promise<LLMChainParams> {
    const {
      messages = [],
      systemPrompt: systemPromptFromParams = '',
      aiPersonFileSourcePath,
      aiPersonConfig: aiPersonConfigFromParams,
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

    const { config: globalAiPersonConfig } = await loadGlobalAiPersonConfig(finalPath)

    let aiPersonConfig: AiPersonConfig | undefined = aiPersonConfigFromParams

    if (aiPersonFileSourcePath && PathUtils.isFile(aiPersonFileSourcePath)) {
      // keep realtime config
      aiPersonConfig = await parseAiPersonFile({
        filePath: aiPersonFileSourcePath,
        globalAiPersonConfig,
      })
    }

    if (overrideModelType && overrideModelType !== aiPersonConfig?.model?.type) {
      aiPersonConfig = {
        model: {
          type: overrideModelType,
        },
      }
    }

    const model = {
      type: ChatModelType.Openai,
      ...aiPersonConfig?.model,
      ...overrideModelsConfig?.[aiPersonConfig?.model?.type as ChatModelType || ''],
    } as AiPersonConfig['model']

    const finalSecrets = await LLMService.getSecretsFormAllWays({
      modelType: model?.type,
      globalAiPersonConfig,
      modelTypeVendorNameMap,
    })

    const finalSystemPrompt = await LLMService.getFinalSystemPrompt({
      finalPath,
      systemPrompt: systemPromptFromParams,
      aiPersonConfig,
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
      buildRequestHeaders(url, requestHeaders) {
        const requestHeadersFromGlobalAiPersonConfig: Record<string, string> = Object.entries(globalAiPersonConfig.urlConfig || {}).find(([urlMatcher]) => {
          // for example: urlMatcher maybe 'https://api.openai.com/*'
          return Boolean(url?.match(urlMatcher))
        })?.[1]?.httpRequestHeader || {}

        return {
          ...requestHeaders,
          ...requestHeadersFromGlobalAiPersonConfig,
        }
      },
    }
  }

  static async getSecretsFormAllWays(params: {
    modelType: ChatModelType | undefined
    globalAiPersonConfig: GlobalAiPersonConfig
    modelTypeVendorNameMap: ModelTypeVendorNameMap | undefined
  }) {
    const { modelType = ChatModelType.Openai, globalAiPersonConfig, modelTypeVendorNameMap } = params

    const secretFromGlobalAiPersonConfig = globalAiPersonConfig.model?.type === modelType ? globalAiPersonConfig.model?.secrets : undefined
    let secretsFromStorage = await getSecrets(modelType || null)

    // if some secret value is '' or null or undefined, should remove
    secretsFromStorage = Object.fromEntries(Object.entries(secretsFromStorage || {}).filter(([_, value]) => value != null && value !== '' && value !== undefined))

    // if user use vendor secrets
    const currentVendorName = modelTypeVendorNameMap?.[modelType] || ''
    const vendorSecrets = await AppConfigService.instance.getSecretsConfig({
      modelType,
      vendorName: currentVendorName,
    })

    const finalSecrets = vendorSecrets || {
      ...secretFromGlobalAiPersonConfig,
      ...secretsFromStorage,
    }

    return finalSecrets as typeof secretsFromStorage
  }

  static async getFinalSystemPrompt(params: {
    finalPath: string
    systemPrompt: string
    aiPersonConfig?: AiPersonConfig
    appendSystemPrompt: string
    contextFilePaths?: string[]
    editingFilePath?: string
  }): Promise<string> {
    const {
      finalPath,
      systemPrompt: systemPromptFromParams = '',
      aiPersonConfig,
      appendSystemPrompt = '',
      contextFilePaths,
      editingFilePath,
    } = params

    let finalSystemPrompt = systemPromptFromParams || aiPersonConfig?.systemPrompt || ''

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
