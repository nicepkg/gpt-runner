import { ChatModelType, type OpenaiSecrets, ServerStorageName } from '@nicepkg/gpt-runner-shared/common'
import { useMutation, useQuery } from '@tanstack/react-query'
import { type FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { VSCodeButton, VSCodeLink } from '@vscode/webview-ui-toolkit/react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { getServerStorage, saveServerStorage } from '../../../../../../networks/server-storage'
import { useLoading } from '../../../../../../hooks/use-loading.hook'
import { HookFormInput } from '../../../../../../components/hook-form/hook-form-input'
import { HookFormTextarea } from '../../../../../../components/hook-form/hook-form-textarea'
import { IS_LOCAL_HOST } from '../../../../../../helpers/constant'
import { StyledForm, StyledFormItem } from '../../settings.styles'

export interface FormData extends Pick<OpenaiSecrets, 'apiKey' | 'accessToken' | 'basePath'> {

}

export const OpenaiSettings: FC = () => {
  const { t } = useTranslation()
  const { setLoading } = useLoading()
  const { data: querySecretsRes } = useQuery({
    queryKey: ['secrets', ChatModelType.Openai],
    queryFn: () => getServerStorage({
      storageName: ServerStorageName.SecretsConfig,
      key: ChatModelType.Openai,
    }),
  })

  const { mutateAsync: saveSecrets } = useMutation({
    mutationKey: ['secrets', ChatModelType.Openai],
    mutationFn: (value: FormData) => saveServerStorage({
      storageName: ServerStorageName.SecretsConfig,
      key: ChatModelType.Openai,
      value,
    }),
  })

  const remoteSecrets = querySecretsRes?.data?.value as OpenaiSecrets | undefined

  const { handleSubmit, formState, control, setValue } = useForm<FormData>({
    mode: 'onBlur',
  })

  useEffect(() => {
    if (remoteSecrets) {
      setValue('apiKey', remoteSecrets.apiKey || '')
      setValue('accessToken', remoteSecrets.accessToken || '')
      setValue('basePath', remoteSecrets.basePath || '')
    }
  }, [remoteSecrets])

  const onSubmit = async (data: FormData) => {
    setLoading(true)

    try {
      await saveSecrets(data)
      toast(t('chat_page.toast_save_success'))
    }
    catch (err) {
      toast(`${t('chat_page.toast_save_error')}: ${err}`)
    }
    finally {
      setLoading(false)
    }
  }

  return <StyledForm onSubmit={handleSubmit(onSubmit)}>

    <StyledFormItem key={0}>
      <HookFormInput
        label={t('chat_page.openai_api_key')}
        placeholder={t('chat_page.openai_api_key_placeholder')}
        name="apiKey"
        errors={formState.errors}
        control={control}
        type="password"
      />
    </StyledFormItem>

    <StyledFormItem key={1}>
      <HookFormInput
        label={t('chat_page.openai_api_base_path')}
        placeholder="https://api.openai.com/v1"
        name="basePath"
        errors={formState.errors}
        control={control}
      />
    </StyledFormItem>

    <StyledFormItem key={2}>
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
    </StyledFormItem>

    <VSCodeButton
      disabled={!IS_LOCAL_HOST}
      appearance='primary'
      type='submit'
    >
      {IS_LOCAL_HOST ? t('chat_page.save_btn') : t('chat_page.disabled_save_openai_config_btn')}
    </VSCodeButton>
  </StyledForm>
}
