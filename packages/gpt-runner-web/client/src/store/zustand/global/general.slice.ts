import type { StateCreator } from 'zustand'
import type { ChatModelType, LocaleLang, ModelTypeVendorNameMap } from '@nicepkg/gpt-runner-shared/common'
import type { GetState } from '../types'
import type { ThemeName } from '../../../styles/themes'
import { getGlobalConfig } from '../../../helpers/global-config'

export interface GeneralSlice {
  langId: LocaleLang
  themeName: ThemeName
  modelTypeVendorNameMap: ModelTypeVendorNameMap
  updateLangId: (langId: LocaleLang) => void
  updateThemeName: (themeName: ThemeName) => void
  updateModelTypeVendorName: (modelType: ChatModelType, vendorName: string) => void
}

export type GeneralState = GetState<GeneralSlice>

function getInitialState() {
  return {
    langId: getGlobalConfig().defaultLangId,
    themeName: getGlobalConfig().defaultTheme,
    modelTypeVendorNameMap: {
    },
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
  updateModelTypeVendorName(modelType, vendorName) {
    const state = get()
    set({
      modelTypeVendorNameMap: {
        ...state.modelTypeVendorNameMap,
        [modelType]: vendorName,
      },
    })
  },
})
