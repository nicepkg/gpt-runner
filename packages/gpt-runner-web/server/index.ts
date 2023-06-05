import './src/proxy'
import path from 'node:path'
import express from 'express'
import cors from 'cors'
import history from 'connect-history-api-fallback'
import { Debug } from '@nicepkg/gpt-runner-shared/common'
import { processControllers } from './src/controllers'
import { errorHandlerMiddleware } from './src/middleware'

const debug = new Debug('server-index')

export const resolvePath = (...paths: string[]) => path.resolve(__dirname, ...paths)

const clientDistPath = resolvePath('../dist/browser')

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

app.listen(3003, () => debug.log('Server is running on port 3003'))
