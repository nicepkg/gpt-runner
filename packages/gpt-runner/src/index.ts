import type { ChatModelType, GlobalAiPersonConfig as IGlobalAiPersonConfig } from '@nicepkg/gpt-runner-shared/common'

export * from '@nicepkg/gpt-runner-shared/common'
export * from '@nicepkg/gpt-runner-shared/node'

type GetStaticValueFromChatModelType<T extends ChatModelType> = T extends ChatModelType ? `${T}` : never

export type GlobalAiPersonConfig = {
  [Key in keyof Omit<IGlobalAiPersonConfig, 'rootPath' | 'exts'>]: Key extends 'model' ? Omit<NonNullable<IGlobalAiPersonConfig[Key]>, 'type'> & {
    type: GetStaticValueFromChatModelType<NonNullable<IGlobalAiPersonConfig[Key]>['type']>
  } : IGlobalAiPersonConfig[Key]
}

export function defineConfig(config: GlobalAiPersonConfig) {
  return config
}
