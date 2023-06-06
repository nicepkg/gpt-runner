import './src/proxy'
import path from 'node:path'
import type { Express } from 'express'
import express from 'express'
import cors from 'cors'
import history from 'connect-history-api-fallback'
import { getPort } from '@nicepkg/gpt-runner-shared/node'
import { processControllers } from './src/controllers'
import { errorHandlerMiddleware } from './src/middleware'

const resolvePath = (...paths: string[]) => path.resolve(__dirname, ...paths)

export const clientDistPath = resolvePath('../dist/browser')

export interface StartServerProps {
  port?: number
  autoFreePort?: boolean
  autoOpen?: boolean
}

export async function startServer(props: StartServerProps): Promise<Express> {
  const { port = 3003, autoFreePort } = props

  const finalPort = await getPort({
    defaultPort: port,
    autoFreePort,
  })

  process.env.GPTR_BASE_SERVER_URL = `http://localhost:${finalPort}`

  const app = express()
  const router = express.Router()

  app.use(cors())

  processControllers(router)

  app.use(express.json())
  app.use('/api', router)

  // for frontend history mode
  app.use(history({
    index: '/index.html',
  }))
  app.use(express.static(clientDistPath))

  app.set('trust proxy', 1)

  app.use(errorHandlerMiddleware)

  app.listen(finalPort, () => console.log(`Server is running on port ${finalPort}`))

  return app
}
