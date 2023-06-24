import type { StateCreator } from 'zustand'
import type { ReadonlyDeep } from '@nicepkg/gpt-runner-shared/common'
import type { GetState } from '../types'
import type { SelectOption } from '../../../components/hook-form/hook-form-select'
import i18n from '../../../helpers/i18n'

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

export interface GeneralSlice {
  langId: LangId | null
  updateLangId: (langId: LangId) => void
}

export type GeneralState = GetState<GeneralSlice>

function getInitialState() {
  return {
    langId: null,
  } satisfies GeneralState
}

export const createGeneralSlice: StateCreator<
  GeneralSlice,
  [],
  [],
  GeneralSlice
> = (set, get) => ({
  ...getInitialState(),
  updateLangId(langId) {
    set({ langId })

    i18n.changeLanguage(langId)
    const direction = i18n.dir()
    document.body.dir = direction
  },
})
