export const DEFAULT_CHAT_NAME = 'New Chat'
export const IS_LOCAL_HOST = ['localhost', '127.0.0.1'].includes(window.location.hostname)
export const MAYBE_IDE = !['http:', 'https:'].includes(window.location.protocol)
export const IS_SAFE = IS_LOCAL_HOST || MAYBE_IDE
