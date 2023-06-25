import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { getGlobalCacheDir } from '../get-cache-dir'
import { getAxiosInstance } from '../axios'
import { Debug } from '../../../common'

const debug = new Debug('tunnel')

// see: https://github.com/gradio-app/gradio/blob/main/gradio/tunneling.py
export class BinaryDownloader {
  private static readonly VERSION = '0.2'
  private static readonly EXTENSION = os.platform() === 'win32' ? '.exe' : ''
  private static readonly MACHINE = os.arch()
  private static readonly ARCH = BinaryDownloader.MACHINE === 'x64' ? 'amd64' : BinaryDownloader.MACHINE
  private static readonly BINARY_NAME = `frpc_${os.type().toLowerCase()}_${BinaryDownloader.ARCH.toLowerCase()}`
  private static readonly BINARY_FILENAME = `${BinaryDownloader.BINARY_NAME}_v${BinaryDownloader.VERSION}`

  public static async getBinaryPath() {
    const cacheDir = await getGlobalCacheDir('nicepkg-tunnel')
    const binaryPath = path.join(cacheDir, BinaryDownloader.BINARY_FILENAME)
    return binaryPath
  }

  public static async downloadBinary() {
    const binaryPath = await BinaryDownloader.getBinaryPath()

    if (!fs.existsSync(binaryPath)) {
      const binaryUrl = `https://cdn-media.huggingface.co/frpc-gradio-${BinaryDownloader.VERSION}/${BinaryDownloader.BINARY_NAME}${BinaryDownloader.EXTENSION}`
      debug.log(`Downloading ${binaryUrl} to ${binaryPath}...`)
      try {
        const axios = getAxiosInstance()
        const response = await axios.get(binaryUrl, {
          responseType: 'arraybuffer',
        })

        await fs.promises.writeFile(binaryPath, response.data, 'binary')
        fs.chmodSync(binaryPath, 0o755)
        debug.log(`Downloaded success ${binaryUrl} to ${binaryPath}`)
      }
      catch (err: any) {
        debug.error(`Failed to download ${binaryUrl}: ${err}`)

        if (err?.response?.status === 403) {
          throw new Error(
            `Cannot set up a share link as this platform is incompatible. Please create a GitHub issue with information about your platform: ${JSON.stringify(
              os.userInfo(),
            )}`,
          )
        }
        throw err
      }
    }
  }
}
