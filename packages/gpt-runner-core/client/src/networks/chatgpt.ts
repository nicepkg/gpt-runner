import type { EventSourceMessage } from '@microsoft/fetch-event-source'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import type { ChatStreamReqParams } from '../../../server/src/controllers/chatgpt.controller'
import { getConfig } from '../constant/config'

export interface fetchChatStreamReqParams extends ChatStreamReqParams {
  namespace?: string
  onMessage?: (ev: EventSourceMessage) => void
  onError?: (error: any) => void
}

export async function fetchChatgptStream(
  params: fetchChatStreamReqParams,
) {
  const {
    messages,
    prompt,
    systemPrompt,
    temperature,
    namespace,
    onMessage = () => {},
    onError = () => {},
  } = params

  const ctrl = new AbortController()

  try {
    fetchEventSource(`${getConfig()}/api/chatgpt/chat-stream`, {
      method: 'POST',
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
      signal: ctrl.signal,
      onmessage: onMessage,
    })
  }
  catch (error) {
    onError(error)
  }

  return ctrl
}
