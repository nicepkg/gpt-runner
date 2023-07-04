import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import type { editor } from 'monaco-editor'

export type Monaco = typeof monaco

export type MonacoEditorInstance = editor.IStandaloneCodeEditor

export type MonacoLanguage = monaco.languages.ILanguageExtensionPoint
