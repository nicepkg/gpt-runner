import type { ChatModelType, UserConfig as IUserConfig } from '@nicepkg/gpt-runner-shared/common'

export * from '@nicepkg/gpt-runner-shared/common'
export * from '@nicepkg/gpt-runner-shared/node'

type GetStaticValueFromChatModelType<T extends ChatModelType> = T extends ChatModelType ? `${T}` : never

export type UserConfig = {
  [Key in keyof IUserConfig]: Key extends 'model' ? Omit<NonNullable<IUserConfig[Key]>, 'type'> & {
    type: GetStaticValueFromChatModelType<NonNullable<IUserConfig[Key]>['type']>
  } : IUserConfig[Key]
}

export function defineConfig(config: UserConfig) {
  return config
}
