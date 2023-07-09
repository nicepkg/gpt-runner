import type { EventSourceMessage } from '@microsoft/fetch-event-source'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { type BaseResponse, type ChatStreamReqParams, STREAM_DONE_FLAG, getErrorMsg } from '@nicepkg/gpt-runner-shared/common'
import * as uuid from 'uuid'
import { getGlobalConfig } from '../helpers/global-config'

export interface FetchChatStreamReqParams extends ChatStreamReqParams {
  namespace?: string
  signal?: AbortSignal
  onMessage?: (ev: EventSourceMessage) => void
  onError?: (error: any) => void
}

export async function fetchLlmStream(
  params: FetchChatStreamReqParams,
) {
  const {
    messages,
    signal,
    prompt,
    systemPrompt,
    appendSystemPrompt,
    singleFilePath,
    singleFileConfig,
    contextFilePaths,
    editingFilePath,
    overrideModelType,
    overrideModelsConfig,
    rootPath,
    namespace,
    onMessage = () => {},
    onError = () => {},
  } = params

  try {
    const finalOverrideModelsConfig = Object.fromEntries(
      Object.entries(overrideModelsConfig || {})
        .map(([key, value]) => {
          return [key, {
            ...value,
            type: key,
          }]
        }),
    )

    await fetchEventSource(`${getGlobalConfig().serverBaseUrl}/api/chatgpt/chat-stream`, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        'namespace': namespace || 'default-namespace',
      },
      body: JSON.stringify({
        prompt,
        messages,
        systemPrompt,
        appendSystemPrompt,
        singleFilePath,
        singleFileConfig,
        contextFilePaths,
        editingFilePath,
        overrideModelType,
        overrideModelsConfig: finalOverrideModelsConfig,
        rootPath,
      } satisfies ChatStreamReqParams),
      openWhenHidden: true,
      onmessage: onMessage,
      onerror(err) {
        onMessage({
          id: uuid.v4(),
          event: '',
          data: JSON.stringify({
            type: 'Fail',
            message: getErrorMsg(err),
            data: getErrorMsg(err),
          } satisfies BaseResponse),
        })

        onMessage({
          id: uuid.v4(),
          event: '',
          data: JSON.stringify({
            type: 'Fail',
            message: getErrorMsg(err),
            data: STREAM_DONE_FLAG,
          } satisfies BaseResponse),
        })

        throw err
      },
    })
  }
  catch (error) {
    console.log('fetchLlmStream error', error)
    onError(error)
  }
}
