import './src/proxy'
import path from 'node:path'
import http from 'node:http'
import type { Express } from 'express'
import express from 'express'
import cors from 'cors'
import history from 'connect-history-api-fallback'
import { PathUtils, getPort } from '@nicepkg/gpt-runner-shared/node'
import { processControllers } from './src/controllers'
import { errorHandlerMiddleware } from './src/middleware'

const dirname = PathUtils.getCurrentDirName(import.meta.url, () => __dirname)

const resolvePath = (...paths: string[]) => path.resolve(dirname, ...paths)

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

  const app = express()
  const router = express.Router()

  app.use(cors())

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
