import { MIN_NODE_VERSION } from '../../common'

export function compareVersion(a: string, b: string) {
  const aParts = a.split('.')
  const bParts = b.split('.')
  const len = Math.max(aParts.length, bParts.length)
  const stringToNum = (str: string) => parseInt(str.match(/\d+/)?.[0] || '0') || 0

  for (let i = 0; i < len; i++) {
    const aPart = stringToNum(aParts[i]) || 0
    const bPart = stringToNum(bParts[i]) || 0

    if (aPart > bPart)
      return 1
    if (aPart < bPart)
      return -1
  }

  return 0
}

export function checkNodeVersion() {
  const currentNodeVersion = process.version

  if (compareVersion(currentNodeVersion, MIN_NODE_VERSION) < 0)
    return `You are using Node ${currentNodeVersion}, but GPT-Runner requires Node ${MIN_NODE_VERSION}.\nPlease upgrade your Node version in https://nodejs.org/en/download`
}

export function canUseNodeFetchWithoutCliFlag() {
  const currentNodeVersion = process.version

  return compareVersion(currentNodeVersion, '18.0.0') > 0
}

export function getRunServerEnv() {
  if (!canUseNodeFetchWithoutCliFlag()) {
    return {
      NODE_OPTIONS: '--experimental-fetch',
      NODE_NO_WARNINGS: '1',
    }
  }

  return {}
}
