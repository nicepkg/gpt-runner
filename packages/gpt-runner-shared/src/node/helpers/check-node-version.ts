import { MIN_NODE_VERSION } from '../../common'

export function checkNodeVersion() {
  const currentNodeVersion = process.version

  if (currentNodeVersion <= MIN_NODE_VERSION)
    return `You are using Node ${currentNodeVersion}, but GPT-Runner requires Node ${MIN_NODE_VERSION}.\nPlease upgrade your Node version in https://nodejs.org/en/download`
}
