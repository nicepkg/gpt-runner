import { memo } from 'react'
import type { FC } from 'react'
import type { FileItemRenderInfo } from '../../shared'
import type { EditorProps } from '../../../../../../components/editor'
import { Editor } from '../../../../../../components/editor'
import type { FileEditorItem } from '../../../../../../store/zustand/file-editor/file-editor-item'
import { EditorWrapper } from './file-content-editor.styles'

export interface FileContentEditorProps extends Omit<EditorProps, 'onSave'> {
  fileItemRenderInfo: FileItemRenderInfo
  onItemUpdate?: (item: FileEditorItem) => void
  onSave?: (item: FileEditorItem) => void
}

export const FileContentEditor: FC<FileContentEditorProps> = memo((props) => {
  const { fileItemRenderInfo, onItemUpdate, onSave, onChange, ...editorProps } = props

  const { item } = fileItemRenderInfo

  if (!fileItemRenderInfo)
    return null

  return <EditorWrapper>
    <Editor
      filePath={item.fullPath}
      path={item.fullPath}
      value={item.editingContent}
      onChange={(value, e) => {
        onChange?.(value || '', e)
        onItemUpdate?.({
          ...item,
          fixed: true,
          editingContent: value || '',
        })
      }}
      onSave={() => {
        if (item.editingContent === item.sourceContent)
          return
        onSave?.(item)
      }}

      {...editorProps}
    ></Editor>
  </EditorWrapper>
})

FileContentEditor.displayName = 'FileContentEditor'
