import type { Monaco } from '@monaco-editor/react'
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

function defaultTsconfig(monaco: Monaco) {
  return {
    ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    baseUrl: 'file:///root/',
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
    allowJs: true,
    skipLibCheck: true,
    noImplicitThis: true,
    emitDecoratorMetadata: true,
    resolveJsonModule: true,
    allowSyntheticDefaultImports: true,
    experimentalDecorators: true,
    noUnusedLocals: false,
    noUnusedParameters: false,
    noImplicitAny: false,
    allowUnreachableCode: true,
    allowUnusedLabels: true,
    suppressImplicitAnyIndexErrors: true,
    strict: false,
    typeRoots: ['node_modules/@types'],
  }
}

function setDefaults(monaco: Monaco, language: monaco.languages.typescript.LanguageServiceDefaults, ignoreDiagnosticCodes: number[] = []) {
  language.setCompilerOptions(defaultTsconfig(monaco))
  language.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
    diagnosticCodesToIgnore: ignoreDiagnosticCodes,
  })
  language.setEagerModelSync(true)
  language.setModeConfiguration({
    completionItems: true,
    codeActions: true,
  })
}

export async function initTsLanguageSettings(monaco: Monaco) {
  const ts = monaco.languages.typescript
  setDefaults(monaco, ts.typescriptDefaults, [6133, 6198, 8006, 8010])
  setDefaults(monaco, ts.javascriptDefaults)
}
