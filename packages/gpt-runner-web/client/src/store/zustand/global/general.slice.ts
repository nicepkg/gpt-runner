import type { StateCreator } from 'zustand'
import type { GetState } from '../types'
import type { LangId } from '../../../helpers/i18n'
import type { ThemeName } from '../../../styles/themes'

export interface GeneralSlice {
  langId: LangId
  themeName: ThemeName
  updateLangId: (langId: LangId) => void
  updateThemeName: (themeName: ThemeName) => void
}

export type GeneralState = GetState<GeneralSlice>

function getInitialState() {
  return {
    langId: 'en',
    themeName: 'default',
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
  },
  updateThemeName(themeName) {
    set({ themeName })
  },
})
