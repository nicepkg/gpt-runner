import { type FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { LocaleLang } from '@nicepkg/gpt-runner-shared/common'
import { StyledForm, StyledFormItem } from '../../settings.styles'
import type { SelectOption } from '../../../../../../components/hook-form/hook-form-select'
import { HookFormSelect } from '../../../../../../components/hook-form/hook-form-select'
import { useGlobalStore } from '../../../../../../store/zustand/global'
import { languageOptions } from '../../../../../../helpers/i18n'
import type { ThemeName } from '../../../../../../styles/themes'

export interface FormData {
  langId: LocaleLang
  themeName: ThemeName
}

export const GeneralSettings: FC = () => {
  const { t } = useTranslation()
  const { langId, themeName, updateLangId, updateThemeName } = useGlobalStore()

  const { formState, control, watch, getValues } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      langId: langId || 'en',
      themeName: themeName || 'default',
    },
  })

  const themeOptions: SelectOption<ThemeName>[] = [
    {
      label: 'Default',
      value: 'default',
    },
    {
      label: 'VSCode Dark',
      value: 'vscodeDark',
    },
    {
      label: 'VSCode Light',
      value: 'vscodeLight',
    },
    {
      label: 'JetBrains Dark',
      value: 'jetbrainsDark',
    },
    {
      label: 'JetBrains Light',
      value: 'jetbrainsLight',
    },
  ]

  useEffect(() => {
    const { langId } = getValues()
    updateLangId(langId)
  }, [watch('langId')])

  useEffect(() => {
    const { themeName } = getValues()
    updateThemeName(themeName)
  }, [watch('themeName')])

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

    <StyledFormItem>
      <HookFormSelect
        label={t('chat_page.settings_theme')}
        name="themeName"
        errors={formState.errors}
        options={themeOptions}
        control={control}
      />
    </StyledFormItem>
  </StyledForm>
}
