import { useCallback, useMemo } from 'react'
import type { AiPersonConfig, SingleChat } from '@nicepkg/gpt-runner-shared/common'
import { countTokenQuick } from '../helpers/utils'
import { useGlobalStore } from '../store/zustand/global'
import { useTempStore } from '../store/zustand/temp'
import { useGlobalAiPersonConfig } from './use-user-config.hook'

export interface UseTokenNumProps {
  rootPath?: string
  chatIdOrChatInstance?: string | SingleChat
  aiPersonConfig?: AiPersonConfig
}
export function useTokenNum(props?: UseTokenNumProps) {
  const { rootPath, chatIdOrChatInstance, aiPersonConfig: aiPersonConfigFromParams } = props || {}

  const {
    provideFileInfoPromptMap,
    provideFileInfoToGptMap,
    checkedFilePaths,
    getChatInstance,
    getContextFilePaths,
  } = useGlobalStore()

  const {
    ideActiveFilePath,
    ideOpeningFilePaths,
    fullPathFileMap,
    getUserSelectTextPrompt,
  } = useTempStore()

  const filePathsPromptTokenNum = countTokenQuick(provideFileInfoPromptMap.allFilePathsPrompt)
  const selectedTextPromptTokenNum = countTokenQuick(getUserSelectTextPrompt())

  const chatInstance: SingleChat | undefined = useMemo(() => {
    if (!chatIdOrChatInstance)
      return undefined
    if (typeof chatIdOrChatInstance === 'string')
      return getChatInstance(chatIdOrChatInstance)

    return chatIdOrChatInstance
  }, [chatIdOrChatInstance, getChatInstance])

  const { aiPersonConfig: aiPersonConfigFromRemote } = useGlobalAiPersonConfig({
    rootPath,
    aiPersonFileSourcePath: chatInstance?.aiPersonFileSourcePath,
    enabled: !aiPersonConfigFromParams,
  })

  const aiPersonConfig = useMemo(() => {
    return aiPersonConfigFromParams || aiPersonConfigFromRemote
  }, [aiPersonConfigFromParams, aiPersonConfigFromRemote])

  const countFilePathsTokenNum = useCallback((filePaths: string[]) => {
    return filePaths.reduce((pre, cur) => {
      const file = fullPathFileMap[cur]
      return pre + (file?.otherInfo?.tokenNum ?? 0)
    }, 0)
  }, [fullPathFileMap])

  const systemPromptTokenNum = useMemo(() => {
    const { systemPrompt } = aiPersonConfig || {}

    if (!systemPrompt)
      return 0

    return countTokenQuick(systemPrompt)
  }, [aiPersonConfig, countTokenQuick])

  const messageTokenNum = useMemo(() => {
    const { messages } = chatInstance || {}

    if (!messages || !messages.length)
      return 0

    return messages.reduce((total, messageItem) => {
      const { text } = messageItem
      return total + countTokenQuick(text)
    }, 0)
  }, [chatInstance, countTokenQuick])

  const checkedFilesContentPromptTokenNum = useMemo(() => countFilePathsTokenNum(checkedFilePaths), [checkedFilePaths, countFilePathsTokenNum])

  const ideOpeningFileTokenNum = useMemo(() => {
    return countFilePathsTokenNum(ideOpeningFilePaths)
  }, [ideOpeningFilePaths, countFilePathsTokenNum])

  const ideActiveFileTokenNum = useMemo(() => {
    if (!ideActiveFilePath)
      return 0
    return countFilePathsTokenNum([ideActiveFilePath])
  }, [ideActiveFilePath, countFilePathsTokenNum])

  const contextFilePaths = getContextFilePaths()
  const contextFilesTokenNum = useMemo(() =>
    countFilePathsTokenNum(contextFilePaths)
  , [contextFilePaths, countFilePathsTokenNum])

  const totalTokenNum = useMemo(() => {
    const { allFilePaths, userSelectedText } = provideFileInfoToGptMap
    let result = systemPromptTokenNum + messageTokenNum + contextFilesTokenNum

    if (allFilePaths)
      result += filePathsPromptTokenNum

    if (userSelectedText)
      result += selectedTextPromptTokenNum

    return result
  }, [
    systemPromptTokenNum,
    messageTokenNum,
    contextFilesTokenNum,
    provideFileInfoToGptMap,
    filePathsPromptTokenNum,
    selectedTextPromptTokenNum,
  ])

  return {
    totalTokenNum,
    systemPromptTokenNum,
    messageTokenNum,
    ideOpeningFileTokenNum,
    ideActiveFileTokenNum,
    checkedFilesContentPromptTokenNum,
    filePathsPromptTokenNum,
    selectedTextPromptTokenNum,
  }
}
