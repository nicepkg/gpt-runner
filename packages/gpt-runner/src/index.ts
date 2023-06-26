import type { UserConfig as IUserConfig } from '@nicepkg/gpt-runner-shared/common'

export * from '@nicepkg/gpt-runner-shared/common'
export * from '@nicepkg/gpt-runner-shared/node'

export type UserConfig = Omit<IUserConfig, 'rootPath'>

export function defineConfig(config: UserConfig) {
  return config
}
