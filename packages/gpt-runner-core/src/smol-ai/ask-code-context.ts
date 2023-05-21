import { Api } from './api'
import { FileManager } from './file-manager'

const DEFAULT_FILE_EXCLUDE = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.ico', '.tif', '.tiff']

export interface AskCodeContextParams {
  prompt: string
  directory: string
  model: string
  openaiKey: string
  excludeFiles?: (string | RegExp)[]
}

export async function askCodeContext({
  prompt,
  directory,
  model,
  openaiKey,
  excludeFiles = DEFAULT_FILE_EXCLUDE,
}: AskCodeContextParams) {
  const relativePathCodeMap = await FileManager.readDir({
    directory,
    exclude: excludeFiles,
  })

  const codeContext = Object.entries(relativePathCodeMap)
    .map(([path, contents]) => `${path}:\n${contents}`)
    .join('\n')

  return Api.askGPT({
    systemPrompt: `
    You are an AI developer who is trying to help a user coding based on their file system.
    The user has provided you with the following files and their contents, finally followed by their question.
    `,
    userPrompt: `
    My files are as follows: ${codeContext}

    My question is: ${prompt}
    `,
    model,
    openaiKey,
  })
}
