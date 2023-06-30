import type { ProxySecrets } from '../../common/types'
import { SecretStorageKey, ServerStorageName } from '../../common/types'
import { getStorage } from './get-storage'

export async function getDefaultProxyUrl() {
  let proxyUrl = ''

  try {
    const { storage } = await getStorage(ServerStorageName.SecretsConfig)
    const proxySecret = await storage.get(SecretStorageKey.Proxy) as ProxySecrets | null
    proxyUrl = proxySecret?.proxyUrl ?? ''
  }
  catch (error) {
    console.error('getDefaultProxyUrl error', error)
  }

  if (proxyUrl)
    return proxyUrl;

  ['HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY'].forEach((key) => {
    if (proxyUrl)
      return

    const upperKey = key.toUpperCase()
    const lowerKey = key.toLowerCase()
    const upperKeyValue = (process.env[upperKey] && process.env[upperKey] !== 'undefined') ? process.env[upperKey] || '' : ''
    const lowerKeyValue = process.env[lowerKey] && process.env[lowerKey] !== 'undefined' ? process.env[lowerKey] || '' : ''

    return proxyUrl = upperKeyValue || lowerKeyValue || ''
  })

  return proxyUrl
}
