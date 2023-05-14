import type { ClientConfig } from '../../../types'

export function getConfig() {
  const defaultConfig: ClientConfig = {
    pageName: 'GPT Runner',
    baseServerUrl: 'http://localhost:3003',
  }
  return {
    ...defaultConfig,
    ...window.__config__,
  }
}
