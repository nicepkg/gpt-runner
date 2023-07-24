import { PathUtils } from '@nicepkg/gpt-runner-shared/node'

export interface GetFinalPathParams {
  path: string | undefined | null
  rootPath?: string
  fieldName: string
  assertType: 'directory' | 'file'
}

export function getValidFinalPath(params: GetFinalPathParams) {
  const { path, rootPath, fieldName, assertType } = params

  if (!path)
    return ''

  const finalPath = rootPath ? PathUtils.resolve(rootPath, path) : PathUtils.resolve(path)

  if (assertType === 'directory' && !PathUtils.isDirectory(finalPath))
    throw new Error(`${fieldName} is not a valid ${assertType}`)

  if (assertType === 'file' && !PathUtils.isFile(finalPath))
    throw new Error(`${fieldName} is not a valid ${assertType}`)

  return finalPath
}
