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
import { SelectWrapper, StyledBadge, StyledVSCodeCheckbox } from './context-settings.styles'

export interface ContextSettingsProps {
  rootPath: string
}

export const ContextSettings = memo((props: ContextSettingsProps) => {
  const { rootPath } = props

  const { t } = useTranslation()
  const {
    provideFileInfoToGptMap,
    checkedFilePaths,
    ideOpeningFilePaths,
    updateProvideFileInfoToGptMap,
  } = useGlobalStore()
  const { filaPathsPromptTokenNum, ideOpeningFileTokenNum, ideActiveFileTokenNum, checkedFilesContentPromptTokenNum } = useTokenNum()

  const { isLoading } = useGetCommonFilesTree({
    rootPath,
  })

  const handleProvideChange = (e: any, key: keyof typeof provideFileInfoToGptMap) => {
    const checked = (e.target as HTMLInputElement).checked
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

    {/* ide opening files or active file */}
    <SelectWrapper>
      <StyledVSCodeCheckbox
        style={{
          marginBottom: 0,
        }}
        checked={isProvideIdeFiles}
        onChange={(e) => {
          const checked = (e.target as HTMLInputElement).checked
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
    </SelectWrapper>

    {/* selected files */}
    <StyledVSCodeCheckbox
      checked={provideFileInfoToGptMap.checkedFileContents}
      onChange={e => handleProvideChange(e, 'checkedFileContents')}
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
      onChange={e => handleProvideChange(e, 'allFilePaths')}
    >
      <Trans
        t={t}
        i18nKey={'chat_page.context_settings_all_file_paths_checkbox_label'}
        values={{
          tokenNum: formatNumWithK(filaPathsPromptTokenNum),
        }}
        components={{
          TokenNumWrapper: <StyledBadge></StyledBadge>,
        }}
      ></Trans>
    </StyledVSCodeCheckbox>
  </StyledForm>
})

ContextSettings.displayName = 'ContextSettings'
