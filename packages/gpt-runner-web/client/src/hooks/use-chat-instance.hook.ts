import { useCallback, useEffect, useState } from 'react'
import type { SingleChat } from '@nicepkg/gpt-runner-shared/common'
import { ChatMessageStatus } from '@nicepkg/gpt-runner-shared/common'
import { useGlobalStore } from '../store/zustand/global'
import type { GenerateAnswerType } from '../store/zustand/global/chat.slice'
import { DEFAULT_CHAT_NAME } from '../helpers/constant'

export interface UseChatInstanceProps {
  /**
   * The chat id to use
   */
  chatId: string | undefined
}

export function useChatInstance(props: UseChatInstanceProps) {
  const { chatId } = props
  const [chatInstance, setChatInstance] = useState<SingleChat>()
  const {
    getChatInstance,
    addChatInstance,
    updateChatInstance,
    removeChatInstance,
    generateChatAnswer,
    regenerateLastChatAnswer,
    stopGeneratingChatAnswer,
    getGptFileTreeItemFromChatId,
    updateSidebarTreeItem,
  } = useGlobalStore()

  useEffect(() => {
    if (!chatId)
      return
    const instance = getChatInstance(chatId)
    if (instance) {
      if (instance.status === ChatMessageStatus.Pending) {
        updateChatInstance(chatId, {
          status: ChatMessageStatus.Error,
        }, false)
      }

      setChatInstance(instance)
    }
  }, [chatId])

  type UpdateCurrentChatInstance = (chat: Partial<SingleChat> | SingleChat, replace?: boolean) => void
  const updateCurrentChatInstance = useCallback((chat: SingleChat | Partial<SingleChat>, replace = false) => {
    if (!chatId)
      return
    return updateChatInstance(chatId, chat as any, Boolean(replace) as false)
  }, [chatId]) as UpdateCurrentChatInstance

  const generateCurrentChatAnswer = useCallback(async (type?: GenerateAnswerType) => {
    if (!chatId)
      return

    // update tree item name when first send on single chat
    const isFirstChat = chatInstance?.messages.length === 0

    if (isFirstChat) {
      const gptFileTreeItem = getGptFileTreeItemFromChatId(chatId)
      const chatTreeItem = gptFileTreeItem.children?.find(item => item.id === chatId)

      if (chatTreeItem?.name === DEFAULT_CHAT_NAME && chatInstance.inputtingPrompt) {
        const name = chatInstance.inputtingPrompt

        updateSidebarTreeItem(chatTreeItem.id, {
          name,
        })

        updateChatInstance(chatId, {
          name,
        }, false)
      }
    }

    return await generateChatAnswer(chatId, type)
  }, [chatId, chatInstance])

  const regenerateCurrentLastChatAnswer = useCallback(async () => {
    if (!chatId)
      return
    return await regenerateLastChatAnswer(chatId)
  }, [chatId])

  const stopCurrentGeneratingChatAnswer = useCallback(() => {
    if (!chatId)
      return
    return stopGeneratingChatAnswer(chatId)
  }, [chatId])

  return {
    chatInstance,
    getChatInstance,
    addChatInstance,
    updateChatInstance,
    updateCurrentChatInstance,
    removeChatInstance,
    generateChatAnswer,
    generateCurrentChatAnswer,
    regenerateLastChatAnswer,
    regenerateCurrentLastChatAnswer,
    stopGeneratingChatAnswer,
    stopCurrentGeneratingChatAnswer,
  }
}
