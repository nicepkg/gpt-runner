import { useCallback, useEffect, useState } from 'react'
import type { SingleChat } from '@nicepkg/gpt-runner-shared/common'
import { ChatMessageStatus } from '@nicepkg/gpt-runner-shared/common'
import { useGlobalStore } from '../store/zustand/global'
import type { GenerateAnswerType } from '../store/zustand/global/chat.slice'

export interface UseChatInstanceProps {
  /**
   * The chat id to use
   */
  chatId: string
}

export function useChatInstance(props: UseChatInstanceProps) {
  const { chatId } = props
  const [chatInstance, setChatInstance] = useState<SingleChat>()
  const { getChatInstance, addChatInstance, updateChatInstance, removeChatInstance, generateChatAnswer, regenerateLastChatAnswer, stopGeneratingChatAnswer } = useGlobalStore()

  useEffect(() => {
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
    return await generateChatAnswer(chatId, type)
  }, [chatId])

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
