import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import type { FC } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { SaveFileContentReqParams } from '@nicepkg/gpt-runner-shared/common'
import { LoadingView } from '../../../../components/loading-view'
import { useFileEditorStore } from '../../../../store/zustand/file-editor'
import type { TabItem } from '../../../../components/tab'
import { PanelTab } from '../../../../components/panel-tab'
import type { FileEditorItem } from '../../../../store/zustand/file-editor/file-editor-item'
import { useElementSizeRealTime } from '../../../../hooks/use-element-size-real-time.hook'
import { saveFileContent } from '../../../../networks/editor'
import { EmptyEditorWrapper, FileEditorWrapper } from './file-editor.styles'
import { FileEditorTabLabel } from './components/file-editor-tab-label'
import { FileContentEditor } from './components/file-content-editor'

interface FileItemRenderInfo {
  item: FileEditorItem
  maybeEndings: string
  displayTitle: string
  fileName: string
  dirPath: string
}

export interface FileEditorProps {
  rootPath?: string
  activeFileFullPath: string
  onActiveFileChange: (item: FileEditorItem) => void
}

export const FileEditor: FC<FileEditorProps> = memo((props) => {
  const { activeFileFullPath, onActiveFileChange } = props
  const [fileEditorRef, { width: fileEditorWidth }] = useElementSizeRealTime<HTMLDivElement>()

  const { t } = useTranslation()
  const {
    fileEditorItems,
    updateFileEditorItem,
    removeFileEditorItem,
  } = useFileEditorStore()
  console.log('fileEditorItems', fileEditorItems)
  const [isLoading, setIsLoading] = useState(false)
  const { mutate: saveFileToRemote, isLoading: saveFileLoading } = useMutation({
    mutationFn: (params: SaveFileContentReqParams) => saveFileContent(params),
  })

  const saveFile = useCallback(async (item: FileEditorItem) => {
    await saveFileToRemote({
      fileFullPath: item.fullPath,
      content: item.editingContent,
    })

    updateFileEditorItem(item.fullPath, {
      ...item,
      sourceContent: item.editingContent,
    })
  }, [saveFileToRemote])

  const fullPathMapRenderInfo = useMemo<Record<string, FileItemRenderInfo>>(() => {
    const map: Record<string, FileItemRenderInfo> = {}
    const fileNameMap = new Map<string, number>()
    const repeatedFileNames: Set<string> = new Set()

    fileEditorItems.forEach((item) => {
      const { fullPath } = item
      const splitPaths = fullPath.split('/')
      const fileName = splitPaths[splitPaths.length - 1] || ''
      const dirPath = splitPaths.slice(0, splitPaths.length - 1).join('/')
      const parentPathItem = splitPaths[splitPaths.length - 2] || ''
      const maybeEndings = parentPathItem ? `.../${parentPathItem}` : ''

      map[fullPath] = {
        item,
        maybeEndings,
        displayTitle: fileName,
        fileName,
        dirPath,
      }
      // If user open the same name file, we need to show parent path
      if (fileName) {
        const count = fileNameMap.get(fileName) || 0
        fileNameMap.set(fileName, count + 1)

        if (count > 0)
          repeatedFileNames.add(fileName)
      }
    })

    fileEditorItems.forEach((item) => {
      const { fullPath } = item
      const { fileName, maybeEndings } = map[fullPath]

      // if repeated, show parent path
      if (repeatedFileNames.has(fileName))
        map[fullPath].displayTitle = `${fileName} ${maybeEndings}`
    })

    return map
  }, [fileEditorItems])

  const showEditorMinimap = useMemo(() => {
    return fileEditorWidth > 800
  }, [fileEditorWidth])

  const fileTabItems = useMemo<TabItem<string>[]>(() => {
    return fileEditorItems.map((item) => {
      const itemRenderInfo = fullPathMapRenderInfo[item.fullPath]

      const onItemUpdate = (item: FileEditorItem) => {
        updateFileEditorItem(item.fullPath, item)
      }

      const onRemoveItem = (item: FileEditorItem) => {
        removeFileEditorItem(item.fullPath)
      }

      return {
        id: item.fullPath,

        label: <FileEditorTabLabel
          fileItemRenderInfo={itemRenderInfo}
          onItemUpdate={onItemUpdate}
          onRemoveItem={onRemoveItem}
          onSave={saveFile}
        ></FileEditorTabLabel>,

        children: <FileContentEditor
          fileItemRenderInfo={itemRenderInfo}
          onItemUpdate={onItemUpdate}
          onSave={saveFile}

          options={{
            minimap: {
              enabled: showEditorMinimap,
            },
          }}
        ></FileContentEditor>,
      } satisfies TabItem<string>
    })
  }, [
    fileEditorItems,
    fullPathMapRenderInfo,
    showEditorMinimap,
    saveFile,
  ])

  useEffect(() => {
    setIsLoading(saveFileLoading)
  }, [saveFileLoading])

  return <FileEditorWrapper ref={fileEditorRef}>
    {isLoading && <LoadingView absolute></LoadingView>}
    {fileTabItems.length
      ? (<PanelTab
      items={fileTabItems}
      activeId={activeFileFullPath}
      onChange={(id) => {
        const item = fullPathMapRenderInfo[id]?.item
        if (item)
          onActiveFileChange(item)
      }}
      style={{
        flex: 1,
      }}
      tabListStyles={{
        justifyContent: 'flex-start',
      }}
      tabItemStyles={{
        padding: 0,
      }}
    />)
      : <EmptyEditorWrapper>{t('chat_page.file_empty_tips')}</EmptyEditorWrapper>}
  </FileEditorWrapper>
})

FileEditor.displayName = 'FileEditor'
