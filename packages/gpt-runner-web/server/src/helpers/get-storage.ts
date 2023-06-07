import { kvsLocalStorage } from '@kvs/node-localstorage'
import { getGlobalCacheDir } from './get-cache-dir'

export enum StorageName {
  FrontendState = 'frontend-state',
  WebPreset = 'web-preset',
}

export async function getStorage(storageName: StorageName) {
  const cacheFolder = await getGlobalCacheDir('gpt-runner-server')

  const storage = await kvsLocalStorage<Record<string, Record<string, any> | null>>({
    name: storageName,
    storeFilePath: cacheFolder,
    version: 1,
  })

  return {
    cacheDir: cacheFolder,
    storage,
  }
}
