import type { Monaco } from '@monaco-editor/react'
import { initTsLanguageSettings } from './init-ts-settings'
import { initJsonLanguageSettings } from './init-json-settings'
import { initMdLanguageSettings } from './init-md-settings'

export async function initLanguageSettings(monaco: Monaco) {
  await initJsonLanguageSettings(monaco)
  await initMdLanguageSettings(monaco)
  await initTsLanguageSettings(monaco)
}
