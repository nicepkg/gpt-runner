import open from 'open'
import fp from 'find-free-ports'

export interface OpenInBrowserProps {
  url: string
}
export function openInBrowser(props: OpenInBrowserProps) {
  const { url } = props

  try {
    open(url)
  }
  catch (error) {
    throw new Error(`Server is started at ${url} but failed to open browser. ${error}`)
  }
}

export interface GetPortProps {
  defaultPort: number
  autoFreePort?: boolean
}

export async function getPort(props: GetPortProps): Promise<number> {
  const { defaultPort, autoFreePort } = props

  if (!autoFreePort)
    return defaultPort

  const canUseDefaultPort = await fp.isFreePort(defaultPort)

  if (canUseDefaultPort)
    return defaultPort

  const [freePort] = await fp.findFreePorts(1)

  return freePort
}
