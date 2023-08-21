import type { LocaleLang, ModelTypeVendorNameMap, PartialChatModelTypeMap } from '@nicepkg/gpt-runner-shared/common'
import type { OverrideModelType } from '../zustand/global/chat.slice'
import type { ThemeName } from '../../styles/themes'
import { getGlobalConfig } from '../../helpers/global-config'
import { BaseEntity } from './base.entity'

export interface SettingsEntityJson {
  langId: LocaleLang
  themeName: ThemeName
  modelTypeVendorNameMap: ModelTypeVendorNameMap
  systemPromptAsUserPrompt: boolean
  overrideModelType: OverrideModelType
  overrideModelsConfig: PartialChatModelTypeMap
  llmContext: {
    allFilePaths: boolean
    checkedFileContents: boolean
    activeIdeFileContents: boolean
    openingIdeFileContents: boolean
    userSelectedText: boolean
  }
}

export class SettingsEntity extends BaseEntity<SettingsEntityJson> {
  protected getDefaultJson(): SettingsEntityJson {
    return {
      langId: getGlobalConfig().defaultLangId,
      themeName: getGlobalConfig().defaultTheme,
      modelTypeVendorNameMap: {
      },
      systemPromptAsUserPrompt: false,
      overrideModelType: '',
      overrideModelsConfig: {},
      llmContext: {
        allFilePaths: false,
        checkedFileContents: true,
        activeIdeFileContents: true,
        openingIdeFileContents: false,
        userSelectedText: true,
      },
    }
  }
}
