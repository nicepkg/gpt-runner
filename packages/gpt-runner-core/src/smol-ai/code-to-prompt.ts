import { Api } from './api'
import { FileManager } from './file-manager'

const DEFAULT_FILE_EXCLUDE = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.ico', '.tif', '.tiff']

export interface Code2PromptParams {
  prompt: string
  directory: string
  model: string
  openaiKey: string
  excludeFiles?: (string | RegExp)[]
}

export async function code2prompt({
  prompt,
  directory,
  model,
  openaiKey,
  excludeFiles = DEFAULT_FILE_EXCLUDE,
}: Code2PromptParams) {
  const relativePathCodeMap = await FileManager.readDir({
    directory,
    exclude: excludeFiles,
  })

  const codeContext = Object.entries(relativePathCodeMap)
    .map(([path, contents]) => `${path}:\n${contents}`)
    .join('\n')

  return Api.askGPT({
    systemPrompt: `
    You are an AI debugger who is trying to fully describe a program, in order for another AI program to reconstruct every file, data structure, function and functionality.
    The user has provided you with the following files and their contents:
    `,

    userPrompt: `
    My files are as follows: ${codeContext}

    ${prompt ? `Take special note of the following: ${prompt}` : ''}

    Describe the program in markdown using specific language that will help another AI program reconstruct the given program in as high fidelity as possible.
    `,
    model,
    openaiKey,
    maxTokens: 2500,
  })
}
