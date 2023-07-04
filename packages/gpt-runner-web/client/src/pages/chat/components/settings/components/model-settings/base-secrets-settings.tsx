import { ChatModelType, ServerStorageName, getModelConfigTypeSchema } from '@nicepkg/gpt-runner-shared/common'
import type { SingleFileConfig } from '@nicepkg/gpt-runner-shared/common'
import { memo, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import type { Path, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react'
import { StyledForm, StyledFormItem } from '../../settings.styles'
import { getServerStorage, saveServerStorage } from '../../../../../../networks/server-storage'
import { IS_SAFE } from '../../../../../../helpers/constant'
import { useLoading } from '../../../../../../hooks/use-loading.hook'

export interface BaseSecretsSettingsFormItemBuildViewState<FormData extends Record<string, any>> {
  useFormReturns: UseFormReturn<FormData, any, undefined>
}

export interface BaseSecretsSettingsFormItemConfig<FormData extends Record<string, any>> {
  name: keyof FormData
  buildView: (state: BaseSecretsSettingsFormItemBuildViewState<FormData>) => ReactNode
}

export interface BaseSecretsSettingsProps<FormData extends Record<string, any>> {
  singleFileConfig?: SingleFileConfig
  formConfig: BaseSecretsSettingsFormItemConfig<FormData>[]
}

function BaseSecretsSettings_<FormData extends Record<string, any>>(props: BaseSecretsSettingsProps<FormData>) {
  const { singleFileConfig, formConfig } = props

  const { t } = useTranslation()
  const { setLoading } = useLoading()
  const currentModelType = singleFileConfig?.model?.type || ChatModelType.Openai

  const { data: querySecretsRes } = useQuery({
    queryKey: ['secrets', currentModelType],
    enabled: !!currentModelType,
    queryFn: () => getServerStorage({
      storageName: ServerStorageName.SecretsConfig,
      key: currentModelType!,
    }),
  })

  const { mutateAsync: saveSecrets } = useMutation({
    mutationFn: (value: FormData) => saveServerStorage({
      storageName: ServerStorageName.SecretsConfig,
      key: currentModelType,
      value,
    }),
  })

  const remoteSecrets = querySecretsRes?.data?.value as FormData | undefined

  const useFormReturns = useForm<FormData>({
    mode: 'onBlur',
    resolver: zodResolver(getModelConfigTypeSchema(currentModelType, 'secrets')),
  })

  const { handleSubmit, setValue } = useFormReturns

  useEffect(() => {
    if (remoteSecrets) {
      Object.keys(remoteSecrets).forEach((key) => {
        setValue(key as Path<FormData>, remoteSecrets[key as keyof FormData])
      })
    }
  }, [remoteSecrets])

  const onSubmit = async (data: FormData) => {
    setLoading(true)

    try {
      await saveSecrets(data)
      toast.success(t('chat_page.toast_save_success'))
    }
    finally {
      setLoading(false)
    }
  }

  return <StyledForm onSubmit={handleSubmit(onSubmit)}>
    {formConfig.map((formItemConfig, index) => {
      const buildViewState: BaseSecretsSettingsFormItemBuildViewState<FormData> = {
        useFormReturns,
      }
      return <StyledFormItem key={index}>
        {formItemConfig.buildView(buildViewState)}
      </StyledFormItem>
    })}

    <VSCodeButton
      disabled={!IS_SAFE}
      appearance='primary'
      type='submit'
    >
      {IS_SAFE ? t('chat_page.save_btn') : t('chat_page.disabled_save_secrets_config_btn')}
    </VSCodeButton>
  </StyledForm>
}

BaseSecretsSettings_.displayName = 'BaseSecretsSettings'

export const BaseSecretsSettings = memo(BaseSecretsSettings_)
