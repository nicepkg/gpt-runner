import { ChatModelType, DEFAULT_ANTHROPIC_API_BASE_PATH } from '@nicepkg/gpt-runner-shared/common'
import type { AnthropicSecrets } from '@nicepkg/gpt-runner-shared/common'
import { type FC, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { HookFormInput } from '../../../../../../../components/hook-form/hook-form-input'
import { BaseSecretsSettings, type BaseSecretsSettingsFormItemConfig } from '../base-secrets-settings'

interface FormData extends Pick<AnthropicSecrets, 'apiKey' | 'basePath'> {
}

export interface AnthropicSecretsSettingsProps {
}

export const AnthropicSecretsSettings: FC<AnthropicSecretsSettingsProps> = memo((props) => {
  const { t } = useTranslation()

  const formConfig: BaseSecretsSettingsFormItemConfig<FormData>[] = [
    {
      name: 'apiKey',
      buildView: ({ useFormReturns: { control, formState } }) => {
        return <>
          <HookFormInput
            label={t('chat_page.anthropic_api_key')}
            placeholder={t('chat_page.anthropic_api_key_placeholder')}
            name="apiKey"
            errors={formState.errors}
            control={control}
            type="password"
          />
        </>
      },
    },
    {
      name: 'basePath',
      buildView: ({ useFormReturns: { control, formState } }) => {
        return <>
          <HookFormInput
            label={t('chat_page.anthropic_api_base_path')}
            placeholder={DEFAULT_ANTHROPIC_API_BASE_PATH}
            name="basePath"
            errors={formState.errors}
            control={control}
          />
        </>
      },
    },
  ]

  return <BaseSecretsSettings modelType={ChatModelType.Anthropic} formConfig={formConfig} />
})

AnthropicSecretsSettings.displayName = 'AnthropicSecretsSettings'
