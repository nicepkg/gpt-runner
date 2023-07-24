import { getStorage, sendSuccessResponse, verifyParamsByZod } from '@nicepkg/gpt-runner-shared/node'
import type { StorageClearReqParams, StorageClearResData, StorageGetItemReqParams, StorageGetItemResData, StorageRemoveItemReqParams, StorageRemoveItemResData, StorageSetItemReqParams, StorageSetItemResData } from '@nicepkg/gpt-runner-shared/common'
import { ServerStorageName, StorageClearReqParamsSchema, StorageGetItemReqParamsSchema, StorageRemoveItemReqParamsSchema, StorageSetItemReqParamsSchema } from '@nicepkg/gpt-runner-shared/common'
import type { ControllerConfig } from '../types'
import { handleStorageKeySet } from '../helpers/handle-storage-key-set'

export const storageControllers: ControllerConfig = {
  namespacePath: '/storage',
  controllers: [
    {
      url: '/',
      method: 'get',
      handler: async (req, res) => {
        const query = req.query as StorageGetItemReqParams

        verifyParamsByZod(query, StorageGetItemReqParamsSchema)

        const { key, storageName } = query
        const { storage, cacheDir } = await getStorage(storageName)
        let value = await storage.get(key)
        const isSafe = req.isSafe

        // Don't send secrets config to client when not open in localhost
        if (storageName === ServerStorageName.SecretsConfig && !isSafe) {
          value = typeof value === 'object'
            ? Object.fromEntries(Object.entries(value || {})
              .map(([k, v]) => [k, v ? '*'.repeat(v.length) : null]))
            : undefined
        }

        sendSuccessResponse(res, {
          data: {
            value,
            cacheDir,
          } satisfies StorageGetItemResData,
        })
      },
    },
    {
      url: '/',
      method: 'post',
      handler: async (req, res) => {
        const body = req.body as StorageSetItemReqParams

        verifyParamsByZod(body, StorageSetItemReqParamsSchema)

        const { storageName, key, value } = body
        const { storage } = await getStorage(storageName)

        if (storageName === ServerStorageName.SecretsConfig && !req.isSafe)
          throw new Error('Cannot set secrets config when not open in localhost')

        await storage.set(key, value)
        await handleStorageKeySet({ key, value, storageName })

        sendSuccessResponse(res, {
          data: null satisfies StorageSetItemResData,
        })
      },
    },
    {
      url: '/',
      method: 'delete',
      requireSafe: true,
      handler: async (req, res) => {
        const body = req.body as StorageRemoveItemReqParams

        verifyParamsByZod(body, StorageRemoveItemReqParamsSchema)

        const { key, storageName } = body
        const { storage } = await getStorage(storageName)
        await storage.delete(key)

        sendSuccessResponse(res, {
          data: null satisfies StorageRemoveItemResData,
        })
      },
    },
    {
      url: '/clear',
      method: 'post',
      requireSafe: true,
      handler: async (req, res) => {
        const body = req.body as StorageClearReqParams

        verifyParamsByZod(body, StorageClearReqParamsSchema)

        const { storageName } = body
        const { storage } = await getStorage(storageName)
        await storage.clear()

        sendSuccessResponse(res, {
          data: null satisfies StorageClearResData,
        })
      },
    },
  ],
}
