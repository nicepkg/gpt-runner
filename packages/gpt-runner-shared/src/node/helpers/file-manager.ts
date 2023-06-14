import { promises as fs } from 'node:fs'
import * as path from 'node:path'
import { PathUtils } from './path-utils'
import { FileUtils } from './file-utils'

export interface ReadFileParams {
  filename: string | string[]
  directory: string
}

export interface ReadDirParams {
  directory: string
  exclude?: (string | RegExp)[]
}

export interface WriteFileParams {
  directory: string
  filename: string
  content: string
  overwrite?: boolean
}

export interface CleanDirParams {
  directory: string
  exclude?: (string | RegExp)[]
}

// current unused, just for smol-ai
export class FileManager {
  static async readFile(params: ReadFileParams): Promise<string> {
    const { filename, directory } = params
    const filenames = Array.isArray(filename) ? filename : [filename]
    const fullPath = filenames
      .map(name => PathUtils.join(directory, name))
      .find(path => PathUtils.isFile(path))

    return FileUtils.readFile({ filePath: fullPath })
  }

  static async readDir({ directory, exclude }: ReadDirParams) {
    if (!PathUtils.isDirectory(directory))
      return {}

    const relativePathContentMap: Record<string, string> = {}
    const files = await fs.readdir(directory)

    await Promise.all(
      files.map(async (file) => {
        const fullPath = PathUtils.join(directory, file)

        if (exclude?.some(ext => file.match(ext)))
          return

        if (await fs.stat(fullPath).then(stat => stat.isDirectory())) {
          const subDirContentMap = await FileManager.readDir({ directory: fullPath, exclude })
          Object.entries(subDirContentMap).forEach(([relativePath, content]) => {
            relativePathContentMap[path.join(file, relativePath)] = content
          })
        }
        else {
          try {
            relativePathContentMap[file] = await FileUtils.readFile({ filePath: fullPath })
          }
          catch (e: any) {
            relativePathContentMap[file] = `Error reading file ${file}: ${e?.message ?? e}`
          }
        }
      }),
    )

    return relativePathContentMap
  }

  static async writeFile({ directory, filename, content, overwrite = true }: WriteFileParams) {
    const fullPath = PathUtils.join(directory, filename)
    await FileUtils.writeFile({ filePath: fullPath, content, overwrite })
  }

  static async cleanDir({ directory, exclude }: CleanDirParams) {
    if (!PathUtils.isDirectory(directory))
      return

    const files = await fs.readdir(directory)

    await Promise.all(
      files.map(async (file) => {
        const fullPath = PathUtils.join(directory, file)

        if (await fs.stat(fullPath).then(stat => stat.isDirectory()))
          await FileManager.cleanDir({ directory: fullPath, exclude })

        if (exclude?.some(ext => file.match(ext)))
          return

        await FileUtils.deletePath(fullPath)
      }),
    )
  }
}
