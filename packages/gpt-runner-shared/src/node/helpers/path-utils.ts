import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export class PathUtils {
  static getCurrentDirName(importMetaUrl: string) {
    const __filename = fileURLToPath(importMetaUrl)
    const __dirname = path.dirname(__filename)
    return __dirname
  }

  static join(...paths: string[]) {
    return path.join(...paths).replace(/\\/g, '/')
  }

  static resolve(...paths: string[]) {
    return path.resolve(...paths).replace(/\\/g, '/')
  }

  static relative(from: string, to: string) {
    return path.relative(from, to).replace(/\\/g, '/')
  }

  static dirname(filePath: string) {
    return path.dirname(filePath).replace(/\\/g, '/')
  }

  static extname(filePath: string) {
    if (!PathUtils.isFile(filePath))
      return ''
    return path.extname(filePath)
  }

  static isFile(filePath: string) {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile()
  }

  static isDirectory(filePath: string) {
    return fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()
  }

  static includeExt(filePath: string, exts: string[] | undefined | null) {
    if (!exts || !Array.isArray(exts))
      return false

    return exts.some(ext => filePath.endsWith(ext))
  }

  static isExit(filePath: string) {
    return fs.existsSync(filePath)
  }

  static isAccessible(filePath: string, mode?: 'F' | 'R' | 'W' | 'X') {
    if (!PathUtils.isExit(filePath))
      return false

    const modeMap: Record<'F' | 'R' | 'W' | 'X', number> = {
      F: fs.constants.F_OK,
      R: fs.constants.R_OK,
      W: fs.constants.W_OK,
      X: fs.constants.X_OK,
    }

    const finalMode = modeMap[mode || 'F'] || fs.constants.F_OK

    try {
      fs.accessSync(filePath, finalMode)
      return true
    }
    catch (err) {
      return false
    }
  }

  static getDirPath(filePath: string) {
    return path.dirname(filePath)
  }
}
