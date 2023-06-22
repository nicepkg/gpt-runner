import { getProcessCwd } from './common'

/* eslint-disable @typescript-eslint/no-namespace */
export interface Env {
  NODE_ENV?: 'development' | 'production'
  OPENAI_API_KEY?: string
  GPTR_DEFAULT_ROOT_PATH?: string
  GPTR_ONLY_LOAD_CONFIG_PATH?: string
  GPTR_BASE_SERVER_URL?: string
}

type EnvName = keyof Env

interface EnvVarConfig {
  /**
   * default value if env var is not defined
   */
  defaultValue?: string

  /**
   * if true, this env var will only be available on server side
   * window.__env__ will not have this env var
   *
   * @default false
   */
  serverSideOnly?: boolean
}

const config: Record<EnvName, EnvVarConfig> = {
  NODE_ENV: {
    defaultValue: 'production',
  },
  OPENAI_API_KEY: {
    serverSideOnly: true,
  },
  GPTR_DEFAULT_ROOT_PATH: {
    defaultValue: getProcessCwd(),
  },
  GPTR_ONLY_LOAD_CONFIG_PATH: {
  },
  GPTR_BASE_SERVER_URL: {
    defaultValue: 'http://localhost:3003',
  },
}

export class EnvConfig {
  static get<T extends EnvName>(key: T): string {
    const envVarConfig = config[key]
    if (!envVarConfig)
      return ''

    const { defaultValue, serverSideOnly = false } = envVarConfig

    // client side
    if (typeof window !== 'undefined' && !serverSideOnly)
      return window?.__env__?.[key] ?? defaultValue ?? ''

    // server side
    return process.env[key] ?? defaultValue ?? ''
  }

  /**
   * get all env vars on server or client side
   * @param type server or client, get all allowed env vars on that scope
   * @param getWays all or process, get  env vars both on process and window.__env__ or only process.env
   * @returns env vars key value map
   */
  static getAllEnvVarsOnScopes(
    type: 'client' | 'server',
    getWays: 'all' | 'process' = 'all',
  ): Partial<Record<EnvName, string>> {
    const envVars: Partial<Record<EnvName, string>> = {}
    for (const _key in config) {
      const key = _key as EnvName
      const keyConfig = config[key]

      if (!keyConfig)
        continue
      const { serverSideOnly } = keyConfig

      if (serverSideOnly && type === 'client')
        continue

      envVars[key] = getWays === 'all' ? EnvConfig.get(key) : process.env[key]
    }
    return envVars
  }

  static logServerSideEnvVars(): void {
    const envVars = EnvConfig.getAllEnvVarsOnScopes('server')
    console.log(
      'Server side environment variables:',
      JSON.stringify(envVars, null, 2),
    )
  }

  static logClientSideEnvVars(): void {
    const envVars = EnvConfig.getAllEnvVarsOnScopes('client')
    console.log(
      'Client side environment variables:',
      JSON.stringify(envVars, null, 2),
    )
  }

  /**
   * for /api/config
   * @returns env vars key value map for window.__env__
   */
  static getClientEnvVarsInServerSide(): Partial<Record<EnvName, string>> {
    return EnvConfig.getAllEnvVarsOnScopes('client', 'all')
  }
}

declare global {
  namespace NodeJS {
    export interface ProcessEnv extends Env {}
  }

  interface Window {
    __env__?: Partial<Env>
  }
}
