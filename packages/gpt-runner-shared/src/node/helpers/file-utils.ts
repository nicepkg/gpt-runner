import { promises as fs } from 'node:fs'
import { createFilterByPattern } from '../../common/helpers/create-filter-pattern'
import type { FilterPattern, MaybePromise } from './../../common/types/common'
import { PathUtils } from './path-utils'

export interface ReadFileParams {
  filePath: string | undefined
  valid?: boolean
}

export interface WriteFileParams {
  filePath: string
  content: string
  overwrite?: boolean
  valid?: boolean
}

export interface EnsurePathParams {
  filePath: string
}

export interface MovePathParams {
  oldPath: string
  newPath: string
}

export interface TravelFilesParams {
  filePath: string
  isValidPath: (filePath: string) => MaybePromise<boolean>
  callback: (filePath: string) => MaybePromise<void>
}

export interface TravelFilesByFilterPatternParams extends TravelFilesParams {
  /**
   * @default []
   */
  exts?: string[]

  /**
   * @default null
   */
  includes?: FilterPattern

  /**
   * @default null
   */
  excludes?: FilterPattern
}

export class FileUtils {
  static async readFile(params: ReadFileParams): Promise<string> {
    const { filePath, valid = true } = params

    if (typeof filePath !== 'string')
      return ''

    if (valid && !PathUtils.isFile(filePath))
      return ''

    if (!filePath)
      return ''

    return fs.readFile(filePath, { encoding: 'utf8' })
  }

  static async writeFile(params: WriteFileParams): Promise<void> {
    const { filePath, content, overwrite = true, valid = true } = params

    if (valid) {
      // check if path is file and is writable
      if (!PathUtils.isAccessible(filePath, 'W'))
        return

      if (!PathUtils.isFile(filePath))
        return
    }

    const dir = PathUtils.getDirPath(filePath)
    if (!PathUtils.isExit(dir))
      await fs.mkdir(dir, { recursive: true })

    if (overwrite)
      await fs.writeFile(filePath, content, { encoding: 'utf8' })

    else
      await fs.appendFile(filePath, content, { encoding: 'utf8' })
  }

  static async deletePath(fullPath: string): Promise<void> {
    if (!PathUtils.isAccessible(fullPath, 'W'))
      await fs.rm(fullPath, { recursive: true })
  }

  static async ensurePath(params: EnsurePathParams): Promise<void> {
    const { filePath } = params

    if (!PathUtils.isAccessible(filePath, 'W'))
      await fs.mkdir(filePath, { recursive: true })
  }

  static async movePath(params: MovePathParams): Promise<void> {
    const { oldPath, newPath } = params

    if (PathUtils.isAccessible(oldPath, 'W'))
      await fs.rename(oldPath, newPath)
  }

  static async travelFiles(params: TravelFilesParams): Promise<void> {
    const { isValidPath, callback } = params
    const filePath = PathUtils.resolve(params.filePath)

    if (!PathUtils.isAccessible(filePath, 'R'))
      return

    const promises: Promise<void>[] = []

    if (PathUtils.isDirectory(filePath)) {
      const entries = await fs.readdir(filePath)

      for (const entry of entries) {
        const fullPath = PathUtils.join(filePath, entry)

        if (!PathUtils.isAccessible(filePath, 'R'))
          continue

        const isValid = await isValidPath(fullPath)

        if (isValid)
          promises.push(FileUtils.travelFiles({ filePath: fullPath, isValidPath, callback }))
      }
    }
    else {
      const result = callback(filePath)
      if (result instanceof Promise)
        promises.push(result)
    }

    await Promise.allSettled(promises)
  }

  static async travelFilesByFilterPattern(params: TravelFilesByFilterPatternParams): Promise<void> {
    const { filePath, isValidPath, callback, exts = [], includes = null, excludes = null } = params

    await FileUtils.travelFiles({
      filePath,
      isValidPath: async (filePath) => {
        // const stats = await fs.stat(filePath)

        if (exts.length > 0 && PathUtils.isFile(filePath) && !PathUtils.includeExt(filePath, exts))
          return false

        if (!createFilterByPattern(includes)(filePath))
          return false

        if (createFilterByPattern(excludes)(filePath))
          return false

        if (!isValidPath(filePath))
          return false

        return true
      },
      callback,
    })
  }
}
