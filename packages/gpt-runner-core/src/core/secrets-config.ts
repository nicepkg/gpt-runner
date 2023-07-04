import { ChatModelType, ServerStorageName } from '@nicepkg/gpt-runner-shared/common'
import type { GetModelConfigType } from '@nicepkg/gpt-runner-shared/common'
import { getStorage } from '@nicepkg/gpt-runner-shared/node'

async function getSecretsStorage() {
  const { storage } = await getStorage(ServerStorageName.SecretsConfig)
  return storage
}

const isValidSecretsStorageKey = (key: string) => Object.values(ChatModelType).includes(key as any)

export type SetSecretsParams = {
  [Key in ChatModelType]?: GetModelConfigType<Key, 'secrets'>
}

export async function setSecrets(params: SetSecretsParams, override = false) {
  const keys = Object.keys(params) as (keyof SetSecretsParams)[]
  const storage = await getSecretsStorage()

  for (const key of keys) {
    if (!isValidSecretsStorageKey(key))
      throw new Error(`Invalid secret storage key ${key}`)

    const value = params[key]
    if (value === undefined)
      continue

    const old = await storage.get(key)
    const finalSecrets = override
      ? value
      : {
          ...old,
          ...value,
        }

    await storage.set(key, finalSecrets)
  }
}

/**
 * get secrets
 * @param key if undefined, returns all secrets
 */
export async function getSecrets<T extends keyof SetSecretsParams | undefined>(key?: T | null): Promise<T extends keyof SetSecretsParams ? SetSecretsParams[T] : SetSecretsParams> {
  const storage = await getSecretsStorage()

  if (key === undefined) {
    const secrets = {} as SetSecretsParams
    for (const key of Object.keys(ChatModelType) as (keyof SetSecretsParams)[])
      secrets[key] = await storage.get(key) as any

    return secrets as any
  }

  if (key === null || !isValidSecretsStorageKey(key))
    throw new Error(`Invalid secret storage key ${key}`)

  return await storage.get(key) as any
}
