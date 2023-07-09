import { memo, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ChatModelType } from '@nicepkg/gpt-runner-shared/common'
import { useForm } from 'react-hook-form'
import { HookFormSelect, type SelectOption } from '../../../../../../components/hook-form/hook-form-select'
import { useGlobalStore } from '../../../../../../store/zustand/global'
import type { OverrideModelType } from '../../../../../../store/zustand/global/chat.slice'
import { StyledForm } from '../../settings.styles'

interface FormData {
  overrideModelType: OverrideModelType
}

export const OverrideModelTypeSettings = memo(() => {
  const { t } = useTranslation()
  const { overrideModelType, updateOverrideModelType } = useGlobalStore()

  const overrideModelTypeSelectOptions: SelectOption<OverrideModelType>[] = useMemo(() => [
    {
      label: t('chat_page.default'),
      value: '',
    },
    {
      label: 'OpenAI',
      value: ChatModelType.Openai,
    },
    {
      label: 'Anthropic',
      value: ChatModelType.Anthropic,
    },
  ], [t])

  const { control, formState, watch } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      overrideModelType,
    },
  })

  useEffect(() => {
    const subscription = watch((formData) => {
      const { overrideModelType } = formData
      updateOverrideModelType(overrideModelType!)
    })

    return () => subscription.unsubscribe()
  }, [watch])

  return <StyledForm>
    <HookFormSelect
      name="overrideModelType"
      errors={formState.errors}
      options={overrideModelTypeSelectOptions}
      control={control}
    />
  </StyledForm>
})

OverrideModelTypeSettings.displayName = 'OverrideModelTypeSettings'
