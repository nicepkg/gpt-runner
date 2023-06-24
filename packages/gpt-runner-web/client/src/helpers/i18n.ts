import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import type { ReadonlyDeep } from '@nicepkg/gpt-runner-shared/common'
import type { SelectOption } from '../components/hook-form/hook-form-select'

export const languageOptions = ([
  {
    label: 'English',
    value: 'en',
  },
  {
    label: '简体中文',
    value: 'zh_CN',
  },
  {
    label: '繁體中文',
    value: 'zh_Hant',
  },
  {
    label: '日本語',
    value: 'ja',
  },
  {
    label: 'Deutsch',
    value: 'de',
  },
] as const) satisfies ReadonlyDeep<SelectOption[]>

export type LangId = typeof languageOptions[number]['value']

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  })

export default i18n
