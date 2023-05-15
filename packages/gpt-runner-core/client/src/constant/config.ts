import type { ClientConfig } from '../../../types'

export function getConfig() {
  const defaultConfig: ClientConfig = {
    pageName: 'GPT Runner',
    baseServerUrl: 'http://localhost:3003',
    isDevelopment: process.env.NODE_ENV === 'development',
  }
  return {
    ...defaultConfig,
    ...window.__config__,
  }
}
