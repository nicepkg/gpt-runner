import type { Monaco } from '@monaco-editor/react'
import { globalAiPersonConfigJsonSchema } from '@nicepkg/gpt-runner-shared/common'

export async function initJsonLanguageSettings(monaco: Monaco) {
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    schemas: [{
      uri: 'gptr-config-schema',
      fileMatch: ['gptr.config.json', 'gpt-runner.config.json'],
      schema: globalAiPersonConfigJsonSchema,
    }],
  })
}
