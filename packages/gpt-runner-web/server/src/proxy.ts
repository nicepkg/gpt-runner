import { canUseNodeFetchWithoutCliFlag, getDefaultProxyUrl } from '@nicepkg/gpt-runner-shared/node'
import { bootstrap } from 'global-agent'
import { Headers, ProxyAgent, Request, Response, fetch, setGlobalDispatcher } from 'undici'
import { ReadableStream } from 'web-streams-polyfill/ponyfill'

if (!canUseNodeFetchWithoutCliFlag()) {
  console.log('GPT Runner: add polyfill for fetch', process.version)
  // polyfill for nodejs < 18.0.0
  globalThis.fetch = fetch as any
  globalThis.Headers = Headers as any
  globalThis.Request = Request as any
  globalThis.Response = Response as any
  globalThis.ReadableStream = ReadableStream as any
}

// global proxy
async function startProxy() {
  process.env.GLOBAL_AGENT_HTTP_PROXY = await getDefaultProxyUrl()
  bootstrap()
}
startProxy()

export async function setProxyUrl(url?: string) {
  process.env.GLOBAL_AGENT_HTTP_PROXY = url || await getDefaultProxyUrl()

  if (!process.env.GLOBAL_AGENT_HTTP_PROXY)
    return

  setGlobalDispatcher(
    new ProxyAgent({
      uri: process.env.GLOBAL_AGENT_HTTP_PROXY!,
      connectTimeout: 60000,
    }),
  )
}
