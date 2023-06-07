import { kvsLocalStorage } from '@kvs/node-localstorage'
import type { ServerStorageName } from '../../common/types'
import { getGlobalCacheDir } from './get-cache-dir'

export async function getStorage(storageName: ServerStorageName) {
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
