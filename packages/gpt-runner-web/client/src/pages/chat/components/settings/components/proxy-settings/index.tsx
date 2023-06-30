import type { ProxySecrets } from '@nicepkg/gpt-runner-shared/common'
import { SecretStorageKey, ServerStorageName } from '@nicepkg/gpt-runner-shared/common'
import { useMutation, useQuery } from '@tanstack/react-query'
import { type FC, memo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { getServerStorage, saveServerStorage } from '../../../../../../networks/server-storage'
import { useLoading } from '../../../../../../hooks/use-loading.hook'
import { HookFormInput } from '../../../../../../components/hook-form/hook-form-input'
import { CAN_SETTING_SECRETS } from '../../../../../../helpers/constant'
import { StyledForm, StyledFormItem } from '../../settings.styles'

export type FormData = ProxySecrets

export const ProxySettings: FC = memo(() => {
  const { t } = useTranslation()
  const { setLoading } = useLoading()
  const { data: querySecretsRes } = useQuery({
    queryKey: ['secrets', SecretStorageKey.Proxy],
    queryFn: () => getServerStorage({
      storageName: ServerStorageName.SecretsConfig,
      key: SecretStorageKey.Proxy,
    }),
  })

  const { mutateAsync: saveSecrets } = useMutation({
    mutationKey: ['secrets', SecretStorageKey.Proxy],
    mutationFn: (value: FormData) => saveServerStorage({
      storageName: ServerStorageName.SecretsConfig,
      key: SecretStorageKey.Proxy,
      value,
    }),
  })

  const remoteSecrets = querySecretsRes?.data?.value as ProxySecrets | undefined

  const { handleSubmit, formState, control, setValue } = useForm<FormData>({
    mode: 'onBlur',
  })

  useEffect(() => {
    if (remoteSecrets)
      setValue('proxyUrl', remoteSecrets.proxyUrl || '')
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
    <StyledFormItem key={0}>
      <HookFormInput
        label={t('chat_page.proxy_url')}
        placeholder={`${t('chat_page.for_example')}: http://127.0.0.1:7890`}
        name="proxyUrl"
        errors={formState.errors}
        control={control}
      />
    </StyledFormItem>

    <VSCodeButton
      disabled={!CAN_SETTING_SECRETS}
      appearance='primary'
      type='submit'
    >
      {CAN_SETTING_SECRETS ? t('chat_page.save_btn') : t('chat_page.disabled_save_secrets_config_btn')}
    </VSCodeButton>
  </StyledForm>
})

ProxySettings.displayName = 'ProxySettings'
