import type { PartialKeys } from '@nicepkg/gpt-runner-shared/common'

export enum FileEditorPermission {
  CanEdit = 'canEdit',
  CanPreview = 'canPreview',
  CanSave = 'canSave',
}

export interface IFileEditorItem {
  relativePath?: string
  fullPath: string
  sourceContent: string
  editingContent: string
  fixed: boolean
  permissions: FileEditorPermission[]
}

export type FileEditorItemOptions = PartialKeys<IFileEditorItem, 'sourceContent' | 'editingContent' | 'fixed' | 'permissions'>

export class FileEditorItem implements IFileEditorItem {
  relativePath?: string
  fullPath: string
  sourceContent: string
  editingContent: string
  fixed: boolean
  permissions: FileEditorPermission[]

  constructor({
    relativePath,
    fullPath,
    sourceContent,
    editingContent,
    fixed,
    permissions,
  }: FileEditorItemOptions) {
    this.relativePath = relativePath
    this.fullPath = fullPath
    this.sourceContent = sourceContent || ''
    this.editingContent = editingContent || ''
    this.fixed = fixed || false
    this.permissions = permissions || Object.values(FileEditorPermission)
  }
}
