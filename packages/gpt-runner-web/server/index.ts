import './src/proxy'
import path from 'node:path'
import express from 'express'
import cors from 'cors'
import history from 'connect-history-api-fallback'
import { processControllers } from './src/controllers'
import { errorHandlerMiddleware } from './src/middleware'

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

app.listen(3003, () => globalThis.console.log('Server is running on port 3003'))
