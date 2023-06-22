import type { UserConfig } from '@nicepkg/gpt-runner-shared/common'

export * from '@nicepkg/gpt-runner-shared/common'
export * from '@nicepkg/gpt-runner-shared/node'

export function defineConfig(config: UserConfig) {
  return config
}
