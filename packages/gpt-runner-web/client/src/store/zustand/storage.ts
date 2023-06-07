import type { StateStorage } from 'zustand/middleware'
import type { ServerStorageValue } from '@nicepkg/gpt-runner-shared/common'
import { ServerStorageName, debounce, tryParseJson } from '@nicepkg/gpt-runner-shared/common'
import { getGlobalConfig } from '../../helpers/global-config'
import { getServerStorage, saveServerStorage } from '../../networks/server-storage'

// just only request once onload
let hasUpdateStateFromRemote: 'pending' | 'finish' | false = false
async function getStateFromServerOnce(key: string) {
  if (hasUpdateStateFromRemote !== false)
    return

  hasUpdateStateFromRemote = 'pending'
  const res = await getServerStorage({
    storageName: ServerStorageName.FrontendState,
    key,
  })
  hasUpdateStateFromRemote = 'finish'
  return res?.data?.value
}

// will save each action state to server
const debounceSaveStateToServer = debounce(async (key: string, value: ServerStorageValue) => {
  if (hasUpdateStateFromRemote !== 'finish')
    return

  return await saveServerStorage({
    storageName: ServerStorageName.FrontendState,
    key,
    value,
  })
}, 1000)

export class CustomStorage implements StateStorage {
  #storage: Storage

  static get prefixKey() {
    const rootPath = getGlobalConfig().rootPath
    return `gpt-runner:${rootPath}:`
  }

  constructor(storage: Storage) {
    this.#storage = storage
  }

  getItem = async (key: string) => {
    const finalKey = CustomStorage.prefixKey + key
    const remoteSourceValue = await getStateFromServerOnce(finalKey)

    if (remoteSourceValue !== undefined) {
      const remoteString = JSON.stringify(remoteSourceValue)
      this.#storage.setItem(finalKey, remoteString)
      return remoteString
    }
    else {
      return this.#storage.getItem(finalKey)
    }
  }

  setItem = (key: string, value: string) => {
    const finalKey = CustomStorage.prefixKey + key

    // save to server
    debounceSaveStateToServer(finalKey, tryParseJson(value))

    return this.#storage.setItem(finalKey, value)
  }

  removeItem = (key: string) => {
    const finalKey = CustomStorage.prefixKey + key

    // save to server
    debounceSaveStateToServer(finalKey, null)

    return this.#storage.removeItem(finalKey)
  }
}
