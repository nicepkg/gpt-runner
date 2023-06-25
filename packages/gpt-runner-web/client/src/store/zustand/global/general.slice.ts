import type { StateCreator } from 'zustand'
import type { LocaleLang } from '@nicepkg/gpt-runner-shared/common'
import type { GetState } from '../types'
import type { ThemeName } from '../../../styles/themes'
import { getGlobalConfig } from '../../../helpers/global-config'

export interface GeneralSlice {
  langId: LocaleLang
  themeName: ThemeName
  updateLangId: (langId: LocaleLang) => void
  updateThemeName: (themeName: ThemeName) => void
}

export type GeneralState = GetState<GeneralSlice>

function getInitialState() {
  return {
    langId: getGlobalConfig().defaultLangId,
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
