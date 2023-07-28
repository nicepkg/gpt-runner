import type { EventSourceMessage } from '@microsoft/fetch-event-source'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { STREAM_DONE_FLAG, getErrorMsg, objectToQueryString } from '@nicepkg/gpt-runner-shared/common'
import type { BaseResponse, ChatStreamReqParams, GetModelNamesForChooseReqParams, GetModelNamesForChooseResData } from '@nicepkg/gpt-runner-shared/common'
import * as uuid from 'uuid'
import { getGlobalConfig } from '../helpers/global-config'
import { myFetch } from '../helpers/fetch'

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
    systemPromptAsUserPrompt,
    singleFilePath,
    singleFileConfig,
    contextFilePaths,
    editingFilePath,
    overrideModelType,
    overrideModelsConfig,
    modelTypeVendorNameMap,
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
        systemPromptAsUserPrompt,
        singleFilePath,
        singleFileConfig,
        contextFilePaths,
        editingFilePath,
        overrideModelType,
        overrideModelsConfig: finalOverrideModelsConfig,
        modelTypeVendorNameMap,
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

export async function getModelNamesForChoose(params: GetModelNamesForChooseReqParams): Promise<BaseResponse<GetModelNamesForChooseResData>> {
  return await myFetch(`${getGlobalConfig().serverBaseUrl}/api/chatgpt/model-names-for-choose?${objectToQueryString({
    ...params,
  })}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
