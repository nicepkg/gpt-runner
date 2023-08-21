import fs from 'node:fs'
import { PathUtils } from '@nicepkg/gpt-runner-shared/node'
import type { LoadConfigResult, LoadConfigSource } from 'unconfig'
import { createConfigLoader as createLoader } from 'unconfig'
import type { GlobalAiPersonConfig } from '@nicepkg/gpt-runner-shared/common'
import { EnvConfig, globalAiPersonConfigWithDefault } from '@nicepkg/gpt-runner-shared/common'

export type { LoadConfigResult, LoadConfigSource }
export type IGlobalAiPersonConfig = GlobalAiPersonConfig & { configFile?: false | string }

export async function loadGlobalAiPersonConfig<U extends IGlobalAiPersonConfig = IGlobalAiPersonConfig>(
  cwd = process.cwd(),
  configOrPath: string | U = cwd,
  extraConfigSources: LoadConfigSource[] = [],
  defaults: Partial<GlobalAiPersonConfig> = {},
): Promise<LoadConfigResult<U>> {
  let inlineConfig = {} as U
  if (typeof configOrPath !== 'string') {
    inlineConfig = configOrPath
    if (inlineConfig.configFile === false) {
      return {
        config: inlineConfig as U,
        sources: [],
      }
    }
    else {
      configOrPath = inlineConfig.configFile || cwd
    }
  }

  const resolved = PathUtils.resolve(EnvConfig.get('GPTR_ONLY_LOAD_CONFIG_PATH') || configOrPath)

  let isFile = false
  if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
    isFile = true
    cwd = PathUtils.dirname(resolved)
  }

  const loader = createLoader<U>({
    sources: isFile
      ? [
          {
            files: resolved,
            extensions: [],
          },
        ]
      : [
          {
            files: [
              '.gpt-runner/gpt-runner.config',
              '.gpt-runner/gptr.config',
              'gpt-runner.config',
              'gptr.config',
            ],
          },
          ...extraConfigSources,
        ],
    cwd,
    defaults: inlineConfig,
  })

  const result = await loader.load()
  result.config = globalAiPersonConfigWithDefault(Object.assign({
    rootPath: PathUtils.resolve(cwd),
  }, defaults, result.config || inlineConfig)) as U

  return result
}
