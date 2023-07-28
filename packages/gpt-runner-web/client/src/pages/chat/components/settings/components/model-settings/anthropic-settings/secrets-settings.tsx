import { ChatModelType, DEFAULT_API_BASE_PATH } from '@nicepkg/gpt-runner-shared/common'
import type { AnthropicSecrets } from '@nicepkg/gpt-runner-shared/common'
import { type FC, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { HookFormInput } from '../../../../../../../components/hook-form/hook-form-input'
import { BaseSecretsSettings } from '../base-secrets-settings'
import type { BaseSecretsFormData, BaseSecretsSettingsFormItemConfig } from '../base-secrets-settings'

interface FormData extends Pick<AnthropicSecrets, 'apiKey' | 'basePath'>, BaseSecretsFormData {
}

export interface AnthropicSecretsSettingsProps {
}

export const AnthropicSecretsSettings: FC<AnthropicSecretsSettingsProps> = memo((props) => {
  const { t } = useTranslation()

  const formConfig: BaseSecretsSettingsFormItemConfig<FormData>[] = [
    {
      name: 'apiKey',
      buildView: ({ useFormReturns: { control, formState }, currentVendorConfig }) => {
        return <>
          <HookFormInput
            label={t('chat_page.anthropic_api_key')}
            placeholder={t('chat_page.anthropic_api_key_placeholder')}
            name="apiKey"
            disabled={Boolean(currentVendorConfig?.vendorSecrets)}
            errors={formState.errors}
            control={control}
            type="password"
          />
        </>
      },
    },
    {
      name: 'basePath',
      buildView: ({ useFormReturns: { control, formState }, currentVendorConfig }) => {
        return <>
          <HookFormInput
            label={t('chat_page.anthropic_api_base_path')}
            placeholder={DEFAULT_API_BASE_PATH[ChatModelType.Anthropic]}
            name="basePath"
            disabled={Boolean(currentVendorConfig?.vendorSecrets)}
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
