import express from 'express'
import { processControllers } from './controllers'

const app = express()
const router = express.Router()

processControllers(router)

app.use(express.static('public'))
app.use(express.json())

app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'authorization, Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

app.use('/api', router)
app.set('trust proxy', 1)

app.listen(3003, () => globalThis.console.log('Server is running on port 3003'))
