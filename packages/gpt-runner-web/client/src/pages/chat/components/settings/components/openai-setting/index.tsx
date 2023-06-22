import { ChatModelType, type OpenaiSecrets, ServerStorageName } from '@nicepkg/gpt-runner-shared/common'
import { useMutation, useQuery } from '@tanstack/react-query'
import { type FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { VSCodeButton, VSCodeLink } from '@vscode/webview-ui-toolkit/react'
import { styled } from 'styled-components'
import { getServerStorage, saveServerStorage } from '../../../../../../networks/server-storage'
import { useLoading } from '../../../../../../hooks/use-loading.hook'
import { HookFormInput } from '../../../../../../components/hook-form/hook-form-input'
import { HookFormTextarea } from '../../../../../../components/hook-form/hook-form-textarea'
import { IS_LOCAL_HOST } from '../../../../../../helpers/constant'

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  margin: 1rem;
`

export const StyledFormItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`

export interface FormData extends Pick<OpenaiSecrets, 'apiKey' | 'accessToken' | 'basePath'> {

}

export const OpenaiSettings: FC = () => {
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
    // defaultValues: {
    //   apiKey: remoteSecrets?.apiKey || '',
    //   accessToken: remoteSecrets?.accessToken || '',
    //   basePath: remoteSecrets?.basePath || '',
    // },
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
      console.log('data', data)
      await saveSecrets(data)
    }
    finally {
      setLoading(false)
    }
  }

  return <StyledForm onSubmit={handleSubmit(onSubmit)}>

    <StyledFormItem>
      <HookFormInput
        key={0}
        label="OpenAI API key"
        className="field-item-input"
        name="apiKey"
        errors={formState.errors}
        control={control}
      />
    </StyledFormItem>

    <StyledFormItem>
      <HookFormInput
        key={3}
        label="OpenAI api Base path"
        className="field-item-input"
        placeholder="https://api.openai.com/v1"
        name="basePath"
        errors={formState.errors}
        control={control}
      />
    </StyledFormItem>

    <StyledFormItem>
      <HookFormTextarea
        key={1}
        label="OpenAI Access token"
        className="field-item-input"
        name="accessToken"
        placeholder="if you don't have openai api key, please provide access token"
        errors={formState.errors}
        control={control}
      />
      <div>
        You can open here to got the access token: <VSCodeLink href="https://chat.openai.com/api/auth/session" target="_blank" rel="noreferrer">https://chat.openai.com/api/auth/session</VSCodeLink>
      </div>
    </StyledFormItem>

    <VSCodeButton
      disabled={!IS_LOCAL_HOST}
      appearance='primary'
      type='submit'
    >
      {IS_LOCAL_HOST ? 'Save' : 'You can\'t save outside localhost'}
    </VSCodeButton>
  </StyledForm>
}
