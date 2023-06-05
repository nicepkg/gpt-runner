import { bootstrap } from 'global-agent'
import { ProxyAgent, setGlobalDispatcher } from 'undici'

// global proxy
process.env.GLOBAL_AGENT_HTTP_PROXY = ['HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY'].reduce((val, key) => {
  const upperKey = key.toUpperCase()
  const lowerKey = key.toLowerCase()
  const upperKeyValue = (process.env[upperKey] && process.env[upperKey] !== 'undefined') ? process.env[upperKey] || '' : ''
  const lowerKeyValue = process.env[lowerKey] && process.env[lowerKey] !== 'undefined' ? process.env[lowerKey] || '' : ''

  return val || upperKeyValue || lowerKeyValue
}, '')
bootstrap()

if (process.env.GLOBAL_AGENT_HTTP_PROXY) {
  setGlobalDispatcher(
    new ProxyAgent({
      uri: process.env.GLOBAL_AGENT_HTTP_PROXY!,
      connectTimeout: 60000,
    }),
  )
}
