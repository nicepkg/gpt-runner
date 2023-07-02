import { DEFAULT_OPENAI_API_BASE_PATH } from '@nicepkg/gpt-runner-shared/common'
import type { OpenaiSecrets, SingleFileConfig } from '@nicepkg/gpt-runner-shared/common'
import { type FC, memo } from 'react'
import { VSCodeLink } from '@vscode/webview-ui-toolkit/react'
import { useTranslation } from 'react-i18next'
import { HookFormInput } from '../../../../../../../components/hook-form/hook-form-input'
import { HookFormTextarea } from '../../../../../../../components/hook-form/hook-form-textarea'
import { BaseSecretsSettings, type BaseSecretsSettingsFormItemConfig } from '../base-secrets-settings'

interface FormData extends Pick<OpenaiSecrets, 'apiKey' | 'accessToken' | 'basePath'> {
}

export interface OpenaiSecretsSettingsProps {
  singleFileConfig: SingleFileConfig
}

export const OpenaiSecretsSettings: FC<OpenaiSecretsSettingsProps> = memo((props) => {
  const { singleFileConfig } = props

  const { t } = useTranslation()

  const formConfig: BaseSecretsSettingsFormItemConfig<FormData>[] = [
    {
      name: 'apiKey',
      buildView: ({ useFormReturns: { control, formState } }) => {
        return <>
          <HookFormInput
            label={t('chat_page.openai_api_key')}
            placeholder={t('chat_page.openai_api_key_placeholder')}
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
            label={t('chat_page.openai_api_base_path')}
            placeholder={DEFAULT_OPENAI_API_BASE_PATH}
            name="basePath"
            errors={formState.errors}
            control={control}
          />
        </>
      },
    }, {
      name: 'accessToken',
      buildView: ({ useFormReturns: { control, formState } }) => {
        return <>
          <HookFormTextarea
            label={t('chat_page.openai_access_token')}
            name="accessToken"
            placeholder={t('chat_page.openai_access_token_placeholder')}
            errors={formState.errors}
            control={control}
          />
          <div>
            {t('chat_page.openai_get_access_token_tips')} <VSCodeLink href="https://chat.openai.com/api/auth/session" target="_blank" rel="noreferrer">https://chat.openai.com/api/auth/session</VSCodeLink>
          </div>
        </>
      },
    },
  ]

  return <BaseSecretsSettings singleFileConfig={singleFileConfig} formConfig={formConfig} />
})

OpenaiSecretsSettings.displayName = 'OpenaiSecretsSettings'
