export const DEFAULT_CHAT_NAME = 'New Chat'
export const IS_LOCAL_HOST = ['localhost', '127.0.0.1'].includes(window.location.hostname)

const _BASE_URL = document.querySelector('base')?.href || '/'
export const BASE_URL = _BASE_URL.endsWith('/') ? _BASE_URL.slice(0, -1) : _BASE_URL
