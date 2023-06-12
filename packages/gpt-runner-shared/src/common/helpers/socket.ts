import * as uuid from 'uuid'
import type { BrowserSocket, MaybePromise, NodeServerSocket, Socket, WssActionName, WssActionNameRequestMap } from '../types'
import { EnvConfig } from './env-config'

type SocketQueueFn = (socket: Socket) => void
export class WssUtils {
  static _instance: WssUtils | undefined
  static defaultWssUrl = `http://${new URL(EnvConfig.get('GPTR_BASE_SERVER_URL')).host}`
  #wssUrl: string
  #socketQueue: SocketQueueFn[] = []
  #hasConnected = false

  static get instance() {
    if (!this._instance)
      this._instance = new WssUtils()

    return this._instance
  }

  constructor(wssUrl?: string) {
    this.#wssUrl = wssUrl ?? WssUtils.defaultWssUrl
  }

  static get isBrowser() {
    return typeof window !== 'undefined'
  }

  static isNodeServerSocket(socket: Socket | undefined): socket is NodeServerSocket {
    return typeof window === 'undefined' && Boolean(socket)
  }

  static isBrowserSocket(socket: Socket | undefined): socket is BrowserSocket {
    return WssUtils.isBrowser && Boolean(socket)
  }

  get wsUrl() {
    return this.#wssUrl
  }

  #wss: Socket | undefined

  #setWss = (socket: Socket) => {
    this.#wss = socket
    this.#socketQueue.forEach(fn => fn(socket))
    this.#socketQueue = []
  }

  get wss() {
    return this.#wss
  }

  connect = async (params?: {
    server: any // http.createServer(expressApp);
  }) => {
    if (this.wss || this.#hasConnected)
      return this.wss

    console.log('Connecting to WS...')
    const { server } = params || {}

    try {
      if (WssUtils.isBrowser)
        await this.#connectBrowserSocket()
      else
        server && await this.#connectNodeSocket(server)

      this.#hasConnected = true

      return this.wss
    }
    catch (error) {
      console.error('Error connecting to WS', error)
      throw error
    }
  }

  // for nodejs
  #connectNodeSocket = async (server: any) => {
    if (WssUtils.isBrowser || this.wss)
      return

    const { Server } = await import('socket.io')

    const serverSocket = new Server(server, {
      cors: {
        origin: '*',
      },
    })

    serverSocket.on('connection', (socket) => {
      this.#setWss(socket)
      this.#handleConnection()
    })
  }

  // for browser
  #connectBrowserSocket = async () => {
    if (!WssUtils.isBrowser || this.wss)
      return

    const { io } = await import('socket.io-client')
    const socket = io(this.wsUrl)
    this.#setWss(socket)

    // if (!WssUtils.isBrowserSocket(this.wss))
    //   return

    // socket.on('connect', () => {
    //   this.#handleConnection()
    // })
  }

  #handleConnection = async () => {
    console.log('Connected to Socket server')
  }

  on = <T extends WssActionName>(eventName: T, callback: (message: WssActionNameRequestMap[T]) => MaybePromise<void>) => {
    if (!this.wss) {
      this.#socketQueue.push((socket) => {
        socket.on(eventName, callback as any)
      })
      return
    }

    (this.wss as NodeServerSocket).on(eventName, callback as any)
  }

  emit = <T extends WssActionName>(eventName: T, message: WssActionNameRequestMap[T]) => {
    if (!this.wss) {
      this.#socketQueue.push((socket) => {
        socket.emit(eventName, message)
      })
      return
    }

    this.wss.emit(eventName, message)
  }

  off = <T extends WssActionName>(eventName: T, callback: (message: WssActionNameRequestMap[T]) => MaybePromise<void>) => {
    if (!this.wss) {
      this.#socketQueue.push((socket) => {
        socket.off(eventName, callback as any)
      })
      return
    }

    this.wss.off(eventName, callback as any)
  }

  emitAndWaitForRes = async <T extends WssActionName>(eventName: T, message: WssActionNameRequestMap[T]) => {
    return new Promise<WssActionNameRequestMap[T]>((resolve, reject) => {
      let destroyFn: () => void

      const timeout = setTimeout(() => {
        destroyFn?.()
        reject(new Error(`WS timeout, actionName: ${eventName}`))
      }, 10000)

      const __id__ = uuid.v4()
      this.emit(eventName, { ...message, __id__ })

      const handler = (message: WssActionNameRequestMap[T]) => {
        if (message.__id__ !== __id__)
          return

        destroyFn?.()
        resolve(message)
      }

      this.on(eventName, handler)

      destroyFn = () => {
        clearTimeout(timeout)
        this.off(eventName, handler)
      }
    })
  }
}
