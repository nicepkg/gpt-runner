import { promises as fs } from 'node:fs'
import { FileManager } from './file-manager'
import { Api } from './api'
import { CodeGenerator } from './code-generator'

const DEFAULT_GENERATED_DIR = 'generated'
const CLEAN_EXCLUDE = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.ico', '.tif', '.tiff']
const DEFAULT_SHARED_DEPENDENCIES_FILE_NAMES = ['shared-dependencies.md', 'shared_dependencies.md']
const DEFAULT_MODEL = 'gpt-4'

export interface CreateAnythingParams {
  prompt: string
  directory: string
  filename?: string
  openaiKey: string
  model?: string
  cleanExclude?: (string | RegExp)[]
}

export async function createAnything({
  prompt,
  directory = DEFAULT_GENERATED_DIR,
  filename,
  cleanExclude = CLEAN_EXCLUDE,
  openaiKey,
  model = DEFAULT_MODEL,
}: CreateAnythingParams) {
  if (prompt.endsWith('.md'))
    prompt = await fs.readFile(prompt, { encoding: 'utf8' })

  const filepathsJson = await Api.askGPT({
    systemPrompt: `You are an AI developer who is trying to write a program that will generate code for the user based on their intent.

    When given their intent, create a complete, exhaustive list of filepaths that the user would write to make the program.

    only list the filepaths you would write, and return them as a python list of strings.
    do not add any other explanation, only return a python list of strings.`,
    userPrompt: `${prompt}`,
    model,
    openaiKey,
  })

  try {
    // eslint-disable-next-line no-eval
    const filepaths = eval(filepathsJson) as string[]

    let sharedDependenciesInfo = await FileManager.readFile({
      directory,
      filename: DEFAULT_SHARED_DEPENDENCIES_FILE_NAMES,
    })

    if (filename) {
      await CodeGenerator.generateFile({
        filename,
        appInfo: prompt,
        filepathsInfo: filepathsJson,
        directory,
        sharedDependenciesInfo,
        model,
        openaiKey,
      })
    }
    else {
      await FileManager.cleanDir({ directory, exclude: cleanExclude })

      sharedDependenciesInfo = await Api.askGPT({
        systemPrompt: `
        You are an AI developer who is trying to write a program that will generate code for the user based on their intent.

        In response to the user's prompt:

        ---
        the app is: ${prompt}
        ---

        the files we have decided to generate are: ${filepathsJson}

        Now that we have a list of files, we need to understand what dependencies they share.
        Please name and briefly describe what is shared between the files we are generating, including exported variables, data schemas, id names of every DOM elements that javascript functions will use, message names, and function names.
        Exclusively focus on the names of the shared dependencies, and do not add any other explanation.`,
        userPrompt: `${prompt}`,
        model,
        openaiKey,
      })

      FileManager.writeFile({
        directory,
        filename: DEFAULT_SHARED_DEPENDENCIES_FILE_NAMES[0],
        content: sharedDependenciesInfo,
      })

      const promises = filepaths.map(async (filename) => {
        return CodeGenerator.generateFile({
          filename,
          appInfo: prompt,
          filepathsInfo: filepathsJson,
          directory,
          openaiKey,
          model,
          sharedDependenciesInfo,
        })
      })

      await Promise.all(promises)
    }
  }
  catch (e) {
    console.error('Failed to parse result:', filepathsJson)
    console.error(e)
  }
}
