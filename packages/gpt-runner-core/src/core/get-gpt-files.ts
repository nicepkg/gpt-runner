import type { Stats } from 'node:fs'
import { existsSync, promises as fs, readFileSync } from 'node:fs'
import * as path from 'node:path'
import type { Ignore } from 'ignore'
import ignore from 'ignore'
import type { Rule } from './types'

interface GenerateFileTreeProps {
  /**
   * @default process.cwd()
   */
  rootPath?: string

  /**
   * @default ['.gpt.md']
   */
  exts?: string[]

  /**
   * @default []
   */
  includes?: Rule[]

  /**
   * @default []
   */
  excludes?: Rule[]

  /**
   * @default true
   */
  respectGitignore?: boolean
}

export async function travelDir(
  dirPath: string,
  isValidPath: (filePath: string, stat: Stats) => boolean | Promise<boolean>,
  callback: (filePath: string, stat: Stats) => void,
) {
  if (!existsSync(dirPath))
    return

  const stat = await fs.stat(dirPath)
  const promises: Promise<void>[] = []

  if (stat.isDirectory()) {
    const entries = await fs.readdir(dirPath)
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry)
      const stat = await fs.stat(fullPath)
      const isValid = await isValidPath(fullPath, stat)
      if (isValid)
        promises.push(travelDir(fullPath, isValidPath, callback))
    }
  }
  else {
    callback(dirPath, stat)
  }

  await Promise.allSettled(promises)
}

export async function getGptFiles({
  rootPath = process.cwd(),
  exts = ['.gpt.md'],
  includes = [],
  excludes = [],
  respectGitignore = true,
}: GenerateFileTreeProps): Promise<string[]> {
  const isGptFile = (filePath: string, stat: Stats) => {
    return stat.isFile() && exts.some(ext => filePath.endsWith(ext))
  }

  const validRule = (filePath: string, rules: Rule[]) => {
    return rules.some((rule) => {
      return typeof rule === 'string'
        ? filePath.includes(path.join(rootPath, rule))
        : typeof rule === 'function' ? rule(filePath) : rule.test(filePath)
    })
  }

  const isInclude = (filePath: string, includes: Rule[]) => {
    return includes.length === 0 || validRule(filePath, includes)
  }

  const isExclude = (filePath: string, excludes: Rule[]) => {
    return excludes.length > 0 && validRule(filePath, excludes)
  }

  const ig: Ignore | null = (() => {
    const gitignorePath = path.join(rootPath, '.gitignore')
    if (!existsSync(gitignorePath))
      return null

    const gitignoreContent = readFileSync(gitignorePath).toString()
    const ig = ignore().add(gitignoreContent)

    return ig
  })()

  const isGitignore = (filePath: string) => {
    if (!respectGitignore)
      return false

    const relativePath = path.relative(rootPath, filePath)

    return ig?.ignores(relativePath) ?? false
  }

  const isValidPath = (filePath: string) => {
    return isInclude(filePath, includes) && !isExclude(filePath, excludes) && !isGitignore(filePath)
  }

  const isValidFile = (filePath: string, stat: Stats) => {
    return isGptFile(filePath, stat) && isValidPath(filePath)
  }

  const gptFilePaths: string[] = []

  await travelDir(rootPath,
    (filePath) => {
      return isValidPath(filePath)
    },
    (filePath, stat) => {
      if (isValidFile(filePath, stat))
        gptFilePaths.push(filePath)
    })

  return gptFilePaths
}
