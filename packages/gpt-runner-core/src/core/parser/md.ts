import type { SingleFileConfig, UserConfig } from '@nicepkg/gpt-runner-shared/common'
import { resolveSingleFileConfig, singleFileConfigWithDefault, tryParseJson } from '@nicepkg/gpt-runner-shared/common'
import { FileUtils } from '@nicepkg/gpt-runner-shared/node'

export interface GptMdFileParserParams {
  filePath: string
  userConfig: UserConfig
}

export async function gptMdFileParser(params: GptMdFileParserParams): Promise<SingleFileConfig> {
  const { filePath, userConfig } = params

  const content = await FileUtils.readFile({ filePath })

  // match ```json
  const configJsonString = content.match(/^\s*?```json([\s\S]*?)```/i)?.[1]?.trim()

  const singleFileConfig = singleFileConfigWithDefault(configJsonString ? tryParseJson(configJsonString, true) : {})

  type ResolveConfigKey = 'userPrompt' | 'systemPrompt'
  const resolveTitleConfig: {
    title: ResolveConfigKey
    levels: string[]
  }[] = [
    {
      title: 'userPrompt',
      levels: ['#', '##'],
    },
    {
      title: 'systemPrompt',
      levels: ['#', '##'],
    },
  ]

  const configKeyValueMap = resolveTitleConfig.reduce((contentMap, item) => {
    const { title, levels } = item
    const titleContentsMap = findContentByTitleName(title, levels, content)
    return {
      ...contentMap,
      [title]: Object.values(titleContentsMap)?.[0]?.trim() ?? '',
    }
  }, {} as Record<ResolveConfigKey, string>)

  return resolveSingleFileConfig({
    userConfig,
    singleFileConfig: {
      ...singleFileConfig,
      ...configKeyValueMap,
    },
  })
}

/**
 * Find content by title name
 * @param titleName Title name should match all possible variations
 * @param levels Heading levels to search, e.g., ["#", "##"]
 * @param content Content to search, as a string
 * @returns Matching content as an object with levels as keys
 */
function findContentByTitleName(titleName: string, levels: string[], content: string): Record<string, string> {
  // Create a regex pattern to match the titleName in different variations
  const pattern = new RegExp(`(${titleName.split(/(?=[A-Z])/).join('[\\s_-]*')})`, 'i')

  // Split the content into lines
  const lines = content.split('\n')

  // Initialize the result object
  const result: Record<string, string> = {}

  // Loop through the lines of content
  let currentLevel = ''
  for (const line of lines) {
    // Check if the line is a matching title
    const match = line.match(new RegExp(`^\\s*(${levels.join('|')})\\s+(${pattern.source})\\s*$`, 'i'))

    if (match) {
      currentLevel = match[1]
      if (!result[currentLevel])
        result[currentLevel] = ''
    }
    else {
      const currentLevelMatchOthers = line.match(new RegExp(`^\\s*(${currentLevel})\\s+`, 'i'))

      if (currentLevelMatchOthers?.[1]) {
        // If the currentLevel is match but title is not match, reset the currentLevel
        currentLevel = ''
      }

      if (currentLevel) {
        // If the currentLevel is set, append the line to the result
        result[currentLevel] += `${line}\n`
      }
    }
  }

  return result
}
