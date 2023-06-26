import type { FC, RefObject } from 'react'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { ChatMessageStatus, ChatRole, ClientEventName, getErrorMsg } from '@nicepkg/gpt-runner-shared/common'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { copyToClipboard } from '@nicepkg/gpt-runner-shared/browser'
import type { ChatMessagePanelProps } from '../../../../components/chat-message-panel'
import { ChatMessagePanel } from '../../../../components/chat-message-panel'
import { ChatMessageInput } from '../../../../components/chat-message-input'
import { IconButton } from '../../../../components/icon-button'
import { useChatInstance } from '../../../../hooks/use-chat-instance.hook'
import type { MessageItemProps } from '../../../../components/chat-message-item'
import { ErrorView } from '../../../../components/error-view'
import { useGlobalStore } from '../../../../store/zustand/global'
import type { GptFileTreeItem } from '../../../../store/zustand/global/sidebar-tree.slice'
import { emitter } from '../../../../helpers/emitter'
import { getGlobalConfig } from '../../../../helpers/global-config'
import { PopoverMenu } from '../../../../components/popover-menu'
import { useKeyboard } from '../../../../hooks/use-keyboard.hook'
import { DragResizeView } from '../../../../components/drag-resize-view'
import { useElementSizeRealTime } from '../../../../hooks/use-element-size-real-time'
import { useTempStore } from '../../../../store/zustand/temp'
import type { MessageCodeBlockTheme } from '../../../../components/chat-message-code-block'
import { isDarkTheme } from '../../../../styles/themes'
import { ChatPanelPopoverTreeWrapper, ChatPanelWrapper } from './chat-panel.styles'
import { createRemarkOpenEditorPlugin } from './remark-plugin'

export interface ChatPanelProps {
  scrollDownRef: RefObject<any>
  chatTreeView?: React.ReactNode
  fileTreeView?: React.ReactNode
  settingsView?: React.ReactNode
  chatId: string
  onChatIdChange: (chatId: string) => void
}

export const ChatPanel: FC<ChatPanelProps> = memo((props) => {
  const {
    scrollDownRef,
    chatTreeView,
    fileTreeView,
    settingsView,
    chatId,
    onChatIdChange,
  } = props

  const { t } = useTranslation()
  const {
    themeName,
    createChatAndActive,
    getGptFileTreeItemFromChatId,
  } = useGlobalStore()

  const {
    chatInstance,
    updateCurrentChatInstance,
    generateCurrentChatAnswer,
    regenerateCurrentLastChatAnswer,
    stopCurrentGeneratingChatAnswer,
  } = useChatInstance({ chatId })

  const status = chatInstance?.status ?? ChatMessageStatus.Success
  const [gptFileTreeItem, setGptFileTreeItem] = useState<GptFileTreeItem>()
  const [chatPanelRef, { width: chatPanelWidth }] = useElementSizeRealTime<HTMLDivElement>()
  const { filesRelativePaths } = useTempStore()

  const filesPathsAllPartsInfo = useMemo(() => {
    // not good, but fast
    return filesRelativePaths.map((item) => {
      return {
        source: item.startsWith('/') ? `.${item}` : item,
        matchPath: item,
      }
    })

    // good, but slow
    // const eachLevelPathInfos: { source: string; matchPath: string }[][] = []

    // filesRelativePaths.forEach((item) => {
    //   const splitPaths = item.split('/')

    //   splitPaths.forEach((_, i) => {
    //     const levelPath = splitPaths.slice(-(i + 1)).join('/')
    //     eachLevelPathInfos[i] = eachLevelPathInfos[i] ?? []
    //     eachLevelPathInfos[i].push({
    //       source: item.startsWith('/') ? `.${item}` : item,
    //       matchPath: levelPath,
    //     })
    //   })
    // })

    // const finalPathInfos: { source: string; matchPath: string }[] = []

    // eachLevelPathInfos.forEach((item) => {
    //   const paths = Array.from(new Set(item))
    //   finalPathInfos.unshift(...paths)
    // })

    // return finalPathInfos
  }, [filesRelativePaths])

  useEffect(() => {
    const gptFileTreeItem = getGptFileTreeItemFromChatId(chatId)
    setGptFileTreeItem(gptFileTreeItem)
  }, [chatId, getGptFileTreeItemFromChatId])

  // copy
  const handleCopy = useCallback(async (value: string) => {
    try {
      await copyToClipboard(value)
      toast.success(t('chat_page.toast_copy_success'))
    }
    catch (error) {
      toast.error(getErrorMsg(error))
    }
  }, [])

  // insert codes
  const handleInsertCodes = useCallback((value: string) => {
    emitter.emit(ClientEventName.InsertCodes, { codes: value })
  }, [])

  // diff codes
  const handleDiffCodes = useCallback((value: string) => {
    emitter.emit(ClientEventName.DiffCodes, { codes: value })
  }, [])

  // edit
  const handleEditMessage = useCallback((value: string) => {
    updateCurrentChatInstance({
      inputtingPrompt: value,
    }, false)
  }, [updateCurrentChatInstance])

  // pre chat
  const handleSwitchPreChat = useCallback(() => {
    const chatIds = gptFileTreeItem?.children?.map(item => item.id) ?? []

    if (chatIds.length === 0)
      return

    const index = chatIds.indexOf(chatId)
    let nextIndex = index + 1

    if (nextIndex >= chatIds.length)
      nextIndex = 0

    const nextChatId = chatIds[nextIndex]
    onChatIdChange(nextChatId)
  }, [gptFileTreeItem, chatId, onChatIdChange])

  // next chat
  const handleSwitchNextChat = useCallback(() => {
    const chatIds = gptFileTreeItem?.children?.map(item => item.id) ?? []

    if (chatIds.length === 0)
      return

    const index = chatIds.indexOf(chatId)
    let nextIndex = index - 1

    if (nextIndex < 0)
      nextIndex = chatIds.length - 1

    const nextChatId = chatIds[nextIndex]
    onChatIdChange(nextChatId)
  }, [gptFileTreeItem, chatId, onChatIdChange])

  // clean
  const handleClearAll = useCallback(() => {
    updateCurrentChatInstance({
      messages: [],
    }, false)
  }, [updateCurrentChatInstance])

  // new chat
  const handleNewChat = useCallback(() => {
    const gptFileId = gptFileTreeItem?.id

    if (!gptFileId)
      return

    createChatAndActive(gptFileId)
  }, [createChatAndActive, gptFileTreeItem])

  // continue
  const handleContinueGenerateAnswer = useCallback(() => {
    updateCurrentChatInstance({
      inputtingPrompt: t('chat_page.continue_inputting_prompt'),
    }, false)
    generateCurrentChatAnswer()
  }, [chatInstance, updateCurrentChatInstance, generateCurrentChatAnswer])

  // stop
  const handleStopGenerateAnswer = useCallback(() => {
    stopCurrentGeneratingChatAnswer()
  }, [stopCurrentGeneratingChatAnswer])

  // send
  const handleGenerateAnswer = useCallback(() => {
    generateCurrentChatAnswer()
  }, [generateCurrentChatAnswer])

  // input change
  const handleInputChange = useCallback((value: string) => {
    updateCurrentChatInstance({
      inputtingPrompt: value,
    }, false)
  }, [updateCurrentChatInstance])

  // keyboard bind ctrl + enter
  useKeyboard('ctrl + enter', handleGenerateAnswer)
  useKeyboard('command + enter', handleGenerateAnswer)

  const buildCodeToolbar: MessageItemProps['buildCodeToolbar'] = ({ contents }) => {
    return <>
      <IconButton
        text={t('chat_page.copy_btn')}
        iconClassName='codicon-copy'
        onClick={() => handleCopy(contents)}
      >
      </IconButton>

      {getGlobalConfig().showInsertCodesBtn && <IconButton
        text={t('chat_page.insert_btn')}
        iconClassName='codicon-insert'
        onClick={() => handleInsertCodes(contents)}
      >
      </IconButton>}

      {getGlobalConfig().showDiffCodesBtn && <IconButton
        text={t('chat_page.diff_btn')}
        iconClassName='codicon-arrow-swap'
        onClick={() => handleDiffCodes(contents)}
      >
      </IconButton>}
    </>
  }

  const codeBlockTheme: MessageCodeBlockTheme = isDarkTheme(themeName) ? 'dark' : 'light'

  const messagePanelProps: ChatMessagePanelProps = {
    messageItems: chatInstance?.messages.map((message, i) => {
      const isLast = i === chatInstance.messages.length - 1
      const isLastTwo = i >= chatInstance.messages.length - 2
      const isAi = message.name === ChatRole.ASSISTANT

      const handleRegenerateMessage = () => {
        if (!isLast)
          return

        if (status === ChatMessageStatus.Pending) {
          // is generating, stop first
          stopCurrentGeneratingChatAnswer()
        }

        regenerateCurrentLastChatAnswer()
      }

      const handleDeleteMessage = () => {
        updateCurrentChatInstance({
          messages: chatInstance.messages.filter((_, index) => index !== i),
        }, false)
      }

      const buildMessageToolbar: MessageItemProps['buildMessageToolbar'] = ({ text }) => {
        return <>
          <IconButton
            text={t('chat_page.copy_btn')}
            iconClassName='codicon-copy'
            onClick={() => handleCopy(text)}
          >
          </IconButton>

          <IconButton
            text={t('chat_page.edit_btn')}
            iconClassName='codicon-edit'
            onClick={() => handleEditMessage(text)}
          >
          </IconButton>

          {isAi && isLast && <IconButton
            text={status === ChatMessageStatus.Error ? t('chat_page.retry_btn') : t('chat_page.regenerate_btn')}
            iconClassName='codicon-sync'
            onClick={handleRegenerateMessage}
          ></IconButton>}

          {status === ChatMessageStatus.Pending && isLast
            ? <IconButton
              text={t('chat_page.stop_btn')}
              iconClassName='codicon-chrome-maximize'
              hoverShowText={false}
              onClick={handleStopGenerateAnswer}
            ></IconButton>
            : <IconButton
              text={t('chat_page.delete_btn')}
              iconClassName='codicon-trash'
              onClick={handleDeleteMessage}
            >
            </IconButton>}
        </>
      }

      return {
        ...message,
        remarkPlugins: [createRemarkOpenEditorPlugin(filesPathsAllPartsInfo)],
        status: isLast ? status : ChatMessageStatus.Success,
        showToolbar: isLastTwo ? 'always' : 'hover',
        showAvatar: chatPanelWidth > 600,
        theme: codeBlockTheme,
        buildCodeToolbar: status === ChatMessageStatus.Pending ? undefined : buildCodeToolbar,
        buildMessageToolbar,
      } satisfies MessageItemProps
    }) ?? [],
  }

  const renderInputToolbar = () => {
    return <>
      {/* left icon */}
      {status !== ChatMessageStatus.Pending && <IconButton
        disabled={!chatInstance?.inputtingPrompt}
        text={t('chat_page.send_btn')}
        hoverShowText={false}
        iconClassName='codicon-send'
        onClick={handleGenerateAnswer}></IconButton>}

      {status === ChatMessageStatus.Pending && <IconButton
        text={t('chat_page.stop_btn')}
        iconClassName='codicon-chrome-maximize'
        hoverShowText={false}
        onClick={handleStopGenerateAnswer}
      ></IconButton>}

      <IconButton
        style={{
          marginRight: 'auto',
        }}
        disabled={status === ChatMessageStatus.Pending}
        text={t('chat_page.continue_btn')}
        iconClassName='codicon-debug-continue-small'
        onClick={handleContinueGenerateAnswer}
      ></IconButton>

      {/* right icon */}
      {/* chat tree */}
      {chatTreeView && <PopoverMenu
        childrenInMenuWhenOpen={false}
        menuStyle={{
          marginLeft: '1rem',
          marginRight: '1rem',
        }}
        buildChildrenSlot={({ isHovering }) => {
          return <IconButton
            style={{
              paddingLeft: '0.5rem',
            }}
            text={t('chat_page.chat_tree_btn')}
            iconClassName='codicon-list-tree'
            hoverShowText={!isHovering}
          ></IconButton>
        }}
        buildMenuSlot={() => {
          return <ChatPanelPopoverTreeWrapper>
            {chatTreeView}
          </ChatPanelPopoverTreeWrapper>
        }}
      />}

      {/* file tree */}
      {fileTreeView && <PopoverMenu
        // isPopoverOpen={true}
        // onPopoverDisplayChange={() => { }}
        childrenInMenuWhenOpen={false}
        clickOutSideToClose={false}
        menuStyle={{
          marginLeft: '1rem',
          marginRight: '1rem',
        }}
        buildChildrenSlot={({ isHovering }) => {
          return <IconButton
            style={{
              paddingLeft: '0.5rem',
            }}
            text={t('chat_page.file_tree_btn')}
            iconClassName='codicon-file'
            hoverShowText={!isHovering}
          ></IconButton>
        }}
        buildMenuSlot={() => {
          return <ChatPanelPopoverTreeWrapper>
            {fileTreeView}
          </ChatPanelPopoverTreeWrapper>
        }}
      />}

      {/* settings panel */}
      {settingsView && <PopoverMenu
        // isPopoverOpen={true}
        // onPopoverDisplayChange={() => { }}
        xPosition='center'
        childrenInMenuWhenOpen={false}
        menuStyle={{
          marginLeft: '1rem',
          marginRight: '1rem',
        }}
        buildChildrenSlot={({ isHovering }) => {
          return <IconButton
            text={t('chat_page.settings_btn')}
            iconClassName='codicon-gear'
            hoverShowText={!isHovering}
            style={{
              paddingLeft: '0.5rem',
              paddingRight: '0.5rem',
            }}
          ></IconButton>
        }}
        buildMenuSlot={() => {
          return <ChatPanelPopoverTreeWrapper>
            {settingsView}
          </ChatPanelPopoverTreeWrapper>
        }}
      />}

      <PopoverMenu
        xPosition='right'
        buildChildrenSlot={({ isHovering, isInMenu }) => {
          return <IconButton
            text={t('chat_page.clear_history_btn')}
            iconClassName='codicon-clear-all'
            showText={isInMenu}
            hoverShowText={!isHovering}
            onClick={handleClearAll}
          ></IconButton>
        }}
        buildMenuSlot={() => {
          return <>
            <IconButton
              text={t('chat_page.pre_chat_btn')}
              iconClassName='codicon-chevron-left'
              hoverShowText={false}
              onClick={handleSwitchPreChat}
            ></IconButton>

            <IconButton
              text={t('chat_page.next_chat_btn')}
              iconClassName='codicon-chevron-right'
              hoverShowText={false}
              onClick={handleSwitchNextChat}
            ></IconButton>

            <IconButton
              text={t('chat_page.new_chat_btn')}
              iconClassName='codicon-add'
              hoverShowText={false}
              onClick={handleNewChat}
            ></IconButton>
          </>
        }}
      />
    </>
  }

  if (!chatId)
    return <ErrorView text={t('chat_page.chat_id_not_found_tips')}></ErrorView>

  return <ChatPanelWrapper ref={chatPanelRef}>
    <ChatMessagePanel ref={scrollDownRef} {...messagePanelProps}></ChatMessagePanel>
    <DragResizeView
      initWidth={chatPanelWidth}
      initHeight={250}
      dragDirectionConfigs={[
        {
          direction: 'top',
          boundary: [-200, 50],
        },
      ]}>
      <ChatMessageInput
        value={chatInstance?.inputtingPrompt || ''}
        onChange={handleInputChange}
        toolbarSlot={renderInputToolbar()}
      ></ChatMessageInput>
    </DragResizeView>
  </ChatPanelWrapper>
})

ChatPanel.displayName = 'ChatPanel'
