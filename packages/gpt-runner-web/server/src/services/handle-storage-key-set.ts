import type { ProxySecrets } from '@nicepkg/gpt-runner-shared/common'
import { SecretStorageKey, ServerStorageName } from '@nicepkg/gpt-runner-shared/common'
import { setProxyUrl } from '../proxy'

export interface HandleStorageKeySetParams {
  key: string
  value: any
  storageName: ServerStorageName
}

export async function handleStorageKeySet(params: HandleStorageKeySetParams) {
  const { key, value, storageName } = params

  // update proxy url
  if (storageName === ServerStorageName.SecretsConfig && key === SecretStorageKey.Proxy) {
    const { proxyUrl = '' } = value || {} as ProxySecrets
    await setProxyUrl(proxyUrl)
  }
}
