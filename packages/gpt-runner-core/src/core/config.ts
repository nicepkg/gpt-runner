import type { SingleFileConfig, UserConfig } from './types'

export interface ResolveSingleFileCConfigProps {
  userConfig: UserConfig
  singleFileConfig: SingleFileConfig
}

export function resolveSingleFileConfig(props: ResolveSingleFileCConfigProps): SingleFileConfig {
  const { userConfig, singleFileConfig } = props

  const resolvedConfig: SingleFileConfig = {
    ...singleFileConfig,
    mode: singleFileConfig.mode ?? userConfig.mode,
    openai: {
      ...userConfig.openai,
      ...singleFileConfig.openai,
    },
  }

  return resolvedConfig
}

export function getSingleFileConfig(singleFileConfig?: Partial<SingleFileConfig>): SingleFileConfig {
  return {
    ...singleFileConfig,
  }
}

export function getUserConfig(userConfig?: Partial<UserConfig>): UserConfig {
  return {
    mode: 'openai',
    rootPath: process.cwd(),
    includes: ['./'],
    excludes: [],
    exts: ['.gpt.md'],
    respectGitignore: true,
    ...userConfig,
    openai: {
      openaiKey: process.env.OPENAI_KEY!,
      model: 'gpt-3.5-turbo',
      temperature: 0.9,
      maxTokens: 2000,
      ...userConfig?.openai,
    },
  }
}
