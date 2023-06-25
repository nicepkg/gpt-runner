import { spawn } from 'node:child_process'
import type { Buffer } from 'node:buffer'
import { BinaryDownloader } from './binary-downloader'

export class TunnelProcess {
  private proc: any
  private command: string[]

  constructor(command: string[]) {
    this.proc = null
    this.command = command
  }

  public async start(): Promise<string> {
    const binaryPath = await BinaryDownloader.getBinaryPath()
    await BinaryDownloader.downloadBinary()
    return this._startProcess(binaryPath)
  }

  public kill() {
    if (this.proc !== null) {
      this.proc.kill('SIGTERM')
      this.proc = null
    }
  }

  private _startProcess(binary: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.proc = spawn(binary, this.command, {
        stdio: ['ignore', 'pipe', 'pipe'],
      })

      process.once('exit', () => this.kill())

      let output = ''
      this.proc.stdout.on('data', (data: Buffer) => {
        output += data.toString()
        const match = output.match(/start proxy success: (.+)/)
        if (match) {
          resolve(match[1])
          output = ''
        }
      })

      this.proc.stderr.on('data', (data: Buffer) => {
        output += data.toString()
      })

      this.proc.on('error', (err: Error) => {
        reject(err)
      })
    })
  }
}
