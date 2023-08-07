import http from 'node:http'
import type { Express } from 'express'
import express from 'express'
import cors from 'cors'
import history from 'connect-history-api-fallback'
import { PathUtils, addNodejsPolyfill, getPort } from '@nicepkg/gpt-runner-shared/node'
import { setProxyUrl } from './src/proxy'
import { processControllers } from './src/controllers'
import { errorHandlerMiddleware, safeCheckMiddleware } from './src/middleware'

addNodejsPolyfill()

export * from './src/helpers/app-config'

const dirname = PathUtils.getCurrentDirName(import.meta.url, () => __dirname)

const resolvePath = (...paths: string[]) => PathUtils.resolve(dirname, ...paths)

export const DEFAULT_CLIENT_DIST_PATH = resolvePath('../dist/browser')

export interface StartServerProps {
  port?: number
  autoFreePort?: boolean
  clientDistPath?: string
}

export async function startServer(props: StartServerProps): Promise<Express> {
  const { port = 3003, autoFreePort, clientDistPath = DEFAULT_CLIENT_DIST_PATH } = props

  const finalPort = await getPort({
    defaultPort: port,
    autoFreePort,
  })

  process.env.GPTR_BASE_SERVER_URL = `http://localhost:${finalPort}`

  await setProxyUrl()

  const app = express()
  const router = express.Router()

  app.use(cors())

  app.use(safeCheckMiddleware)

  processControllers(router)

  app.use(express.json({ limit: '25mb' }))
  app.use(express.urlencoded({ limit: '25mb', extended: true }))
  app.use('/api', router)

  // for frontend history mode
  app.use(history({
    index: '/index.html',
  }))
  app.use(express.static(clientDistPath))

  app.set('trust proxy', 1)

  app.use(errorHandlerMiddleware)

  const server = http.createServer(app)

  // await processWsControllers(server)

  server.listen(finalPort, () => console.log(`Server is running on port ${finalPort}`))

  return app
}
