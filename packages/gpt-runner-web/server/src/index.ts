import './proxy'
import express from 'express'
import cors from 'cors'
import { processControllers } from './controllers'

const app = express()
const router = express.Router()

app.use(cors())

processControllers(router)

app.use(express.static('public'))
app.use(express.json())

app.use('/api', router)
app.set('trust proxy', 1)

app.listen(3003, () => globalThis.console.log('Server is running on port 3003'))
