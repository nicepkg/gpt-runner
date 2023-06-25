import { getErrorMsg } from '../../../common'
import { getAxiosInstance } from '../axios'
import { TunnelProcess } from './tunnel-process'

export interface TunnelOptions {
  remoteHost?: string
  remotePort?: number
  localHost?: string
  localPort: number
  shareToken?: string
}

export class Tunnel {
  private tunnelProcess!: TunnelProcess

  public GRADIO_API_SERVER_URL = 'https://api.gradio.app/v2/tunnel-request'
  public url: string | null
  private remoteHost: string
  private remotePort: number
  private localHost: string
  private localPort: number
  private shareToken: string

  constructor(
    options: TunnelOptions,
  ) {
    const {
      remoteHost,
      remotePort,
      localHost,
      localPort,
      shareToken,
    } = options

    this.url = null
    this.remoteHost = remoteHost || ''
    this.remotePort = remotePort || 0
    this.localHost = localHost || 'localhost'
    this.localPort = localPort
    this.shareToken = shareToken || ''
  }

  public async initProcess() {
    if (!this.remoteHost || !this.remotePort) {
      try {
        // see: https://github.com/gradio-app/gradio/blob/9e13cf3890de3024c729031f763767c82d3b7d63/gradio/networking.py#L181
        const axios = getAxiosInstance()
        const res = await axios.get(this.GRADIO_API_SERVER_URL)
        const data = res.data
        this.remoteHost = data[0].host
        this.remotePort = data[0].port
      }
      catch (err) {
        throw new Error(`Failed to fetch ${this.GRADIO_API_SERVER_URL}: ${getErrorMsg(err)}`)
      }
    }

    const command = [
      'http',
      '-n',
      this.shareToken,
      '-l',
      `${this.localPort}`,
      '-i',
      this.localHost,
      '--uc',
      '--sd',
      'random',
      '--ue',
      '--server_addr',
      `${this.remoteHost}:${this.remotePort}`,
      '--disable_log_color',
    ]

    this.tunnelProcess = new TunnelProcess(command)
  }

  public async startTunnel(): Promise<string> {
    if (!this.tunnelProcess)
      await this.initProcess()

    this.url = await this.tunnelProcess.start()
    return this.url
  }

  public kill() {
    if (this.tunnelProcess) {
      console.log(
        `Killing tunnel ${this.localHost}:${this.localPort} <> ${this.url}`,
      )
      this.tunnelProcess.kill()
    }
  }
}
