import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import type { editor } from 'monaco-editor'

export type Monaco = typeof monaco

export type MonacoEditorInstance = editor.IStandaloneCodeEditor

export type MonacoLanguage = monaco.languages.ILanguageExtensionPoint

export type Tsconfig = Parameters<typeof monaco.languages.typescript.typescriptDefaults.setCompilerOptions>[0]
