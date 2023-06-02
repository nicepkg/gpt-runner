import type { EventSourceMessage } from '@microsoft/fetch-event-source'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import type { ChatStreamReqParams } from '@nicepkg/gpt-runner-shared/common'

export interface FetchChatStreamReqParams extends ChatStreamReqParams {
  namespace?: string
  signal?: AbortSignal
  onMessage?: (ev: EventSourceMessage) => void
  onError?: (error: any) => void
}

export async function fetchChatgptStream(
  params: FetchChatStreamReqParams,
) {
  const {
    messages,
    signal,
    prompt,
    systemPrompt,
    singleFileConfig,
    rootPath,
    namespace,
    onMessage = () => {},
    onError = () => {},
  } = params

  try {
    await fetchEventSource('/api/chatgpt/chat-stream', {
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
        singleFileConfig,
        rootPath,
      } satisfies ChatStreamReqParams),
      onmessage: onMessage,
      onerror: onError,
    })
  }
  catch (error) {
    console.log('fetchChatgptStream error', error)
    onError(error)
  }
}
