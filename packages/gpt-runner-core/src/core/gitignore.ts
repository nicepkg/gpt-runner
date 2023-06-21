import { GPT_RUNNER_OFFICIAL_FOLDER } from '@nicepkg/gpt-runner-shared/common'
import { FileUtils, PathUtils } from '@nicepkg/gpt-runner-shared/node'
import ignore from 'ignore'

export interface GetIgnoreInstanceParams {
  rootPath: string
}

export async function getIgnoreFunction(params: GetIgnoreInstanceParams) {
  const { rootPath } = params

  const gitignorePath = PathUtils.join(rootPath, '.gitignore')
  const gitignoreContent = await FileUtils.readFile({ filePath: gitignorePath })
  const ig = ignore().add(gitignoreContent)

  return (filePath: string): boolean => {
    const relativePath = PathUtils.relative(rootPath, filePath)

    if (relativePath.includes(GPT_RUNNER_OFFICIAL_FOLDER))
      return false

    return ig?.ignores(relativePath) ?? false
  }
}
