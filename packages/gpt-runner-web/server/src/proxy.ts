import { getDefaultProxyUrl } from '@nicepkg/gpt-runner-shared/node'
import { bootstrap } from 'global-agent'
import { ProxyAgent, setGlobalDispatcher } from 'undici'

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
