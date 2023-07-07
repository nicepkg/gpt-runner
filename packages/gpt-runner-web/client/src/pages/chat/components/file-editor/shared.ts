import type { FileEditorItem } from '../../../../store/zustand/file-editor/file-editor-item'

export interface FileItemRenderInfo {
  item: FileEditorItem
  maybeEndings: string
  displayTitle: string
  fileName: string
  dirPath: string
}
