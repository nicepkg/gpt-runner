import type { EventSourceMessage } from '@microsoft/fetch-event-source'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import type { ChatStreamReqParams } from '../../../server/src/controllers/chatgpt.controller'
import { EnvConfig } from '../../../env-config'

export interface fetchChatStreamReqParams extends ChatStreamReqParams {
  namespace?: string
  signal?: AbortSignal
  onMessage?: (ev: EventSourceMessage) => void
  onError?: (error: any) => void
}

export async function fetchChatgptStream(
  params: fetchChatStreamReqParams,
) {
  const {
    messages,
    signal,
    prompt,
    systemPrompt,
    temperature,
    namespace,
    onMessage = () => {},
    onError = () => {},
  } = params

  try {
    await fetchEventSource(`${EnvConfig.get('BASE_SERVER_URL')}/api/chatgpt/chat-stream`, {
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
        temperature,
      }),
      onmessage: onMessage,
      onerror: onError,
    })
  }
  catch (error) {
    console.log('fetchChatgptStream error', error)
    onError(error)
  }
}
