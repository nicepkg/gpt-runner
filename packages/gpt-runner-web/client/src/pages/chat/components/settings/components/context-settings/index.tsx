import { memo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyledForm } from '../../settings.styles'
import { useGlobalStore } from '../../../../../../store/zustand/global'
import { formatNumWithK } from '../../../../../../helpers/utils'
import { useGetCommonFilesTree } from '../../../../../../hooks/use-get-common-files-tree.hook'
import { LoadingView } from '../../../../../../components/loading-view'
import type { ISelectOption } from '../../../../../../components/select-option'
import { SelectOption } from '../../../../../../components/select-option'
import { useTokenNum } from '../../../../../../hooks/use-token-num.hook'
import { getGlobalConfig } from '../../../../../../helpers/global-config'
import { useTempStore } from '../../../../../../store/zustand/temp'
import { SelectWrapper, StyledBadge, StyledVSCodeCheckbox } from './context-settings.styles'

export interface ContextSettingsProps {
  rootPath: string
}

export const ContextSettings = memo((props: ContextSettingsProps) => {
  const { rootPath } = props

  const { t } = useTranslation()
  const {
    systemPromptAsUserPrompt,
    provideFileInfoToGptMap,
    checkedFilePaths,
    updateProvideFileInfoToGptMap,
    updateSystemPromptAsUserPrompt,
  } = useGlobalStore()

  const {
    ideOpeningFilePaths,
  } = useTempStore()

  const { selectedTextPromptTokenNum, filePathsPromptTokenNum, ideOpeningFileTokenNum, ideActiveFileTokenNum, checkedFilesContentPromptTokenNum } = useTokenNum()

  const { isLoading } = useGetCommonFilesTree({
    rootPath,
  })

  const handleProvideChange = (checked: boolean, key: keyof typeof provideFileInfoToGptMap) => {
    updateProvideFileInfoToGptMap({
      [key]: checked,
    })
  }

  const isProvideIdeFiles = provideFileInfoToGptMap.openingIdeFileContents || provideFileInfoToGptMap.activeIdeFileContents

  const ideFileAsPromptOptions: ISelectOption<keyof typeof provideFileInfoToGptMap>[] = [{
    label: <Trans
      t={t}
      i18nKey={'chat_page.context_settings_opening_ide_file_contents_checkbox_tips'}
      values={{
        fileNum: ideOpeningFilePaths.length,
        tokenNum: formatNumWithK(ideOpeningFileTokenNum),
      }}
      components={{
        FileNumWrapper: <StyledBadge></StyledBadge>,
        TokenNumWrapper: <StyledBadge></StyledBadge>,
      }}
    />,
    value: 'openingIdeFileContents',
  }, {
    label: <Trans
      t={t}
      i18nKey={'chat_page.context_settings_active_ide_file_contents_checkbox_tips'}
      values={{
        tokenNum: formatNumWithK(ideActiveFileTokenNum),
      }}
      components={{
        TokenNumWrapper: <StyledBadge></StyledBadge>,
      }}
    />,
    value: 'activeIdeFileContents',
  }]

  const [ideOptionActiveValue, setIdeOptionActiveValue] = useState<keyof typeof provideFileInfoToGptMap>(() => {
    if (provideFileInfoToGptMap.openingIdeFileContents)
      return 'openingIdeFileContents'

    return 'activeIdeFileContents'
  })

  return <StyledForm>
    {isLoading && <LoadingView absolute></LoadingView>}

    {/* system prompt as user prompt */}
    <StyledVSCodeCheckbox
      checked={systemPromptAsUserPrompt}
      onClick={() => updateSystemPromptAsUserPrompt(!systemPromptAsUserPrompt)}
    >
      {t('chat_page.context_settings_system_prompt_as_user_prompt_tips')}
    </StyledVSCodeCheckbox>

    {/* selected text */}
    {getGlobalConfig().showUserSelectedTextContextOptions && <StyledVSCodeCheckbox
      checked={provideFileInfoToGptMap.userSelectedText}
      onClick={() => handleProvideChange(!provideFileInfoToGptMap.userSelectedText, 'userSelectedText')}
    >
      <Trans
        t={t}
        i18nKey={'chat_page.context_settings_selected_text_checkbox_tips'}
        values={{
          tokenNum: formatNumWithK(selectedTextPromptTokenNum),
        }}
        components={{
          TokenNumWrapper: <StyledBadge></StyledBadge>,
        }}
      ></Trans>
    </StyledVSCodeCheckbox>}

    {/* ide opening files or active file */}
    {getGlobalConfig().showIdeFileContextOptions && <SelectWrapper>
      <StyledVSCodeCheckbox
        style={{
          marginBottom: 0,
        }}
        checked={isProvideIdeFiles}
        onClick={() => {
          const checked = !isProvideIdeFiles
          updateProvideFileInfoToGptMap({
            [ideOptionActiveValue]: checked,
          })
        }}
      >
        {ideFileAsPromptOptions.find(item => item.value === ideOptionActiveValue)?.label}
      </StyledVSCodeCheckbox>

      <SelectOption
        options={ideFileAsPromptOptions}
        value={ideOptionActiveValue}
        onChange={(_value) => {
          const value = _value as keyof typeof provideFileInfoToGptMap
          setIdeOptionActiveValue(value)

          if (!isProvideIdeFiles)
            return

          updateProvideFileInfoToGptMap({
            openingIdeFileContents: value === 'openingIdeFileContents',
            activeIdeFileContents: value === 'activeIdeFileContents',
          })
        }} />
    </SelectWrapper>}

    {/* selected files */}
    <StyledVSCodeCheckbox
      checked={provideFileInfoToGptMap.checkedFileContents}
      onClick={() => handleProvideChange(!provideFileInfoToGptMap.checkedFileContents, 'checkedFileContents')}
    >
      <Trans
        t={t}
        i18nKey={'chat_page.context_settings_selected_files_checkbox_label'}
        values={{
          fileNum: checkedFilePaths.length,
          tokenNum: formatNumWithK(checkedFilesContentPromptTokenNum),
        }}
        components={{
          FileNumWrapper: <StyledBadge></StyledBadge>,
          TokenNumWrapper: <StyledBadge></StyledBadge>,
        }}
      ></Trans>
    </StyledVSCodeCheckbox>

    {/* all file paths */}
    <StyledVSCodeCheckbox
      checked={provideFileInfoToGptMap.allFilePaths}
      onClick={() => handleProvideChange(!provideFileInfoToGptMap.allFilePaths, 'allFilePaths')}
    >
      <Trans
        t={t}
        i18nKey={'chat_page.context_settings_all_file_paths_checkbox_label'}
        values={{
          tokenNum: formatNumWithK(filePathsPromptTokenNum),
        }}
        components={{
          TokenNumWrapper: <StyledBadge></StyledBadge>,
        }}
      ></Trans>
    </StyledVSCodeCheckbox>
  </StyledForm>
})

ContextSettings.displayName = 'ContextSettings'
