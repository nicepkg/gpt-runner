import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { LocaleLang, type ReadonlyDeep } from '@nicepkg/gpt-runner-shared/common'
import type { SelectOption } from '../components/hook-form/hook-form-select'
import { getGlobalConfig } from './global-config'

export const languageOptions = ([
  {
    label: 'English',
    value: LocaleLang.English,
  },
  {
    label: '简体中文',
    value: LocaleLang.ChineseSimplified,
  },
  {
    label: '繁體中文',
    value: LocaleLang.ChineseTraditional,
  },
  {
    label: '日本語',
    value: LocaleLang.Japanese,
  },
  {
    label: 'Deutsch',
    value: LocaleLang.German,
  },
] as const) satisfies ReadonlyDeep<SelectOption[]>

export function getLang(): LocaleLang {
  const documentLangToLangMap: Map<string, LocaleLang> = new Map([
    ['en', LocaleLang.English],
    ['zh-CN', LocaleLang.ChineseSimplified],
    ['zh-TW', LocaleLang.ChineseTraditional],
    ['zh-HK', LocaleLang.ChineseTraditional],
    ['ja', LocaleLang.Japanese],
    ['de', LocaleLang.German],
  ])

  const lang = navigator.language || document.documentElement.lang
  return documentLangToLangMap.get(lang) || LocaleLang.English
}

export function initI18n() {
  i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: LocaleLang.English,
      debug: false,
      backend: {
        loadPath: `${getGlobalConfig().baseUrl}/locales/{{lng}}.json`,
      },
      interpolation: {
        escapeValue: false,
      },
      returnNull: false,
    })
}
