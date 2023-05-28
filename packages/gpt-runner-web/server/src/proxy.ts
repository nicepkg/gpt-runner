import { bootstrap } from 'global-agent'
import { ProxyAgent, setGlobalDispatcher } from 'undici'

// global proxy
process.env.GLOBAL_AGENT_HTTP_PROXY = process.env.HTTP_PROXY || process.env.http_proxy
bootstrap()

setGlobalDispatcher(
  new ProxyAgent({
    uri: process.env.GLOBAL_AGENT_HTTP_PROXY!,
    connectTimeout: 60000,
  }),
)
