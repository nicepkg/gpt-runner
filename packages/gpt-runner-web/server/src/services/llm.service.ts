import { ChatModelType, DEFAULT_MODEL_NAMES_FOR_CHOOSE, toUnixPath } from '@nicepkg/gpt-runner-shared/common'
import type { ChatStreamReqParams, GetModelNamesForChooseReqParams, ModelTypeVendorNameMap, SingleFileConfig, UserConfig } from '@nicepkg/gpt-runner-shared/common'
import type { LLMChainParams } from '@nicepkg/gpt-runner-core'
import { createFileContext, getSecrets, loadUserConfig, parseGptFile } from '@nicepkg/gpt-runner-core'
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

    const { config: userConfig } = await loadUserConfig(finalPath)

    const finalSecrets = await LLMService.getSecretsFormAllWays({
      modelType,
      userConfig,
      modelTypeVendorNameMap,
    })

    let result: string[] = []

    result = Object.entries(userConfig.urlConfig || {}).find(([urlMatcher]) => {
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

    const finalSecrets = await LLMService.getSecretsFormAllWays({
      modelType: model?.type,
      userConfig,
      modelTypeVendorNameMap,
    })

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
      buildRequestHeaders(url, requestHeaders) {
        const requestHeadersFromUserConfig: Record<string, string> = Object.entries(userConfig.urlConfig || {}).find(([urlMatcher]) => {
          // for example: urlMatcher maybe 'https://api.openai.com/*'
          return Boolean(url?.match(urlMatcher))
        })?.[1]?.httpRequestHeader || {}

        return {
          ...requestHeaders,
          ...requestHeadersFromUserConfig,
        }
      },
    }
  }

  static async getSecretsFormAllWays(params: {
    modelType: ChatModelType | undefined
    userConfig: UserConfig
    modelTypeVendorNameMap: ModelTypeVendorNameMap | undefined
  }) {
    const { modelType = ChatModelType.Openai, userConfig, modelTypeVendorNameMap } = params

    const secretFromUserConfig = userConfig.model?.type === modelType ? userConfig.model?.secrets : undefined
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
      ...secretFromUserConfig,
      ...secretsFromStorage,
    }

    return finalSecrets as typeof secretsFromStorage
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
