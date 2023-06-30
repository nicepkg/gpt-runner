import type { OpenaiModelConfig } from '@nicepkg/gpt-runner-shared/common'
import { type FC, memo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { useLoading } from '../../../../../../hooks/use-loading.hook'
import { HookFormInput } from '../../../../../../components/hook-form/hook-form-input'
import { StyledForm, StyledFormItem } from '../../settings.styles'

export interface FormData extends Pick<OpenaiModelConfig, 'modelName' | 'temperature' | 'maxTokens' | 'topP' | 'frequencyPenalty' | 'presencePenalty'> {

}

export const OpenaiModelSettings: FC = memo(() => {
  const { t } = useTranslation()
  const { setLoading } = useLoading()

  const remoteSecrets = {} as any

  const { handleSubmit, formState, control, setValue } = useForm<FormData>({
    mode: 'onBlur',
  })

  useEffect(() => {
    if (remoteSecrets) {
      setValue('modelName', remoteSecrets.modelName || '')
      setValue('temperature', remoteSecrets.temperature || '')
      setValue('maxTokens', remoteSecrets.maxTokens || '')
      setValue('topP', remoteSecrets.topP || '')
      setValue('frequencyPenalty', remoteSecrets.frequencyPenalty || '')
      setValue('presencePenalty', remoteSecrets.presencePenalty || '')
    }
  }, [remoteSecrets])

  const onSubmit = async (data: FormData) => {
    setLoading(true)

    toast.success(t('chat_page.toast_save_success'))
  }

  return <StyledForm onSubmit={handleSubmit(onSubmit)}>

    <StyledFormItem key={0}>
      <HookFormInput
        label={'Model Name'}
        placeholder={'Current is: gpt-3.5-turbo-16k'}
        name="modelName"
        errors={formState.errors}
        control={control}
      />
    </StyledFormItem>

    <StyledFormItem key={1}>
      <HookFormInput
        label={'Temperature'}
        placeholder={'Current is: 0.9'}
        name="temperature"
        errors={formState.errors}
        control={control}
      />
    </StyledFormItem>

    <StyledFormItem key={2}>
      <HookFormInput
        label={'Max Tokens'}
        name="maxTokens"
        placeholder={'Current is: 2000'}
        errors={formState.errors}
        control={control}
      />
    </StyledFormItem>

    <StyledFormItem key={3}>
      <HookFormInput
        label={'Top P'}
        name="topP"
        placeholder={'Current is: 0.9'}
        errors={formState.errors}
        control={control}
      />
    </StyledFormItem>

    <StyledFormItem key={4}>
      <HookFormInput
        label={'Frequency Penalty'}
        name="frequencyPenalty"
        placeholder={'Current is: 0.0'}
        errors={formState.errors}
        control={control}
      />
    </StyledFormItem>

    <StyledFormItem key={5}>
      <HookFormInput
        label={'Presence Penalty'}
        name="presencePenalty"
        placeholder={'Current is: 0.0'}
        errors={formState.errors}
        control={control}
      />
    </StyledFormItem>

    <VSCodeButton
      appearance='primary'
      type='submit'
    >
      {t('chat_page.save_btn')}
    </VSCodeButton>
  </StyledForm>
})

OpenaiModelSettings.displayName = 'OpenaiModelSettings'
