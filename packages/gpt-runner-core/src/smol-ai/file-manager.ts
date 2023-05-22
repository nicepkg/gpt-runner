import { existsSync, promises as fs, statSync } from 'node:fs'
import * as path from 'node:path'

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

export class FileManager {
  static async readFile({
    filename,
    directory,
  }: ReadFileParams) {
    const filenames = Array.isArray(filename) ? filename : [filename]
    const exitFilename = filenames.find((filename) => {
      const fullPath = path.join(directory, filename)
      return existsSync(fullPath) && statSync(fullPath).isFile()
    })

    if (!exitFilename)
      return ''

    const fullPath = path.join(directory, exitFilename)

    return fs.readFile(fullPath, { encoding: 'utf8' })
  }

  static async readDir({
    directory,
    exclude,
  }: ReadDirParams) {
    const isExit = existsSync(directory) && statSync(directory).isDirectory()
    const relativePathContentMap: Record<string, string> = {}

    if (!isExit)
      return relativePathContentMap

    const files = await fs.readdir(directory)
    const readDirPromises = files.map(async (file) => {
      const fullPath = path.join(directory, file)

      if (exclude?.some(ext => file.match(ext)))
        return Promise.resolve()

      const isDir = await fs.stat(fullPath).then(stat => stat.isDirectory())

      if (isDir) {
        const subDirContentMap = await FileManager.readDir({ directory: fullPath, exclude })
        Object.entries(subDirContentMap).forEach(([relativePath, content]) => {
          relativePathContentMap[path.join(file, relativePath)] = content
        })

        return Promise.resolve()
      }

      let content = ''
      try {
        content = await fs.readFile(fullPath, { encoding: 'utf8' })
      }
      catch (e: any) {
        content = `Error reading file ${file}: ${e?.message ?? e}`
      }

      relativePathContentMap[file] = content
    })

    await Promise.all(readDirPromises)

    return relativePathContentMap
  }

  static async writeFile({
    directory,
    filename,
    content,
    overwrite = true,
  }: WriteFileParams) {
    const fullPath = path.join(directory, filename)
    await fs.mkdir(path.dirname(fullPath), { recursive: true })
    if (overwrite)
      await fs.writeFile(fullPath, content, { encoding: 'utf8' })
    else
      await fs.appendFile(fullPath, content, { encoding: 'utf8' })
  }

  static async cleanDir({
    directory,
    exclude,
  }: CleanDirParams) {
    const isExit = existsSync(directory) && statSync(directory).isDirectory()
    if (!isExit)
      return

    const files = await fs.readdir(directory)
    const unlinkPromises = files.map(async (file) => {
      const fullPath = path.join(directory, file)
      const isDir = await fs.stat(fullPath).then(stat => stat.isDirectory())

      if (isDir)
        await FileManager.cleanDir({ directory: fullPath, exclude })

      if (exclude?.some(ext => file.match(ext)))
        return Promise.resolve()

      return fs.unlink(fullPath)
    })

    await Promise.all(unlinkPromises)
  }
}
