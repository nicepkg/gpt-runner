import { type FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { StyledForm, StyledFormItem } from '../../settings.styles'
import { type LangId, languageOptions } from '../../../../../../store/zustand/global/general.slice'
import { HookFormSelect } from '../../../../../../components/hook-form/hook-form-select'
import { useGlobalStore } from '../../../../../../store/zustand/global'

export interface FormData {
  langId: LangId
}

export const GeneralSettings: FC = () => {
  const { t } = useTranslation()
  const { langId, updateLangId } = useGlobalStore()

  const { formState, control, watch, getValues } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      langId: langId || 'en',
    },
  })

  useEffect(() => {
    const { langId } = getValues()
    updateLangId(langId)
  }, [watch('langId')])

  return <StyledForm>
    <StyledFormItem>
      <HookFormSelect
        label={t('chat_page.settings_language')}
        name="langId"
        errors={formState.errors}
        options={languageOptions}
        control={control}
      />
    </StyledFormItem>
  </StyledForm>
}
