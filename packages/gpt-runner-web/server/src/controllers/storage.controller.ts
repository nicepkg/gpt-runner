import { getStorage, sendSuccessResponse, verifyParamsByZod } from '@nicepkg/gpt-runner-shared/node'
import type { StorageClearReqParams, StorageClearResData, StorageGetItemReqParams, StorageGetItemResData, StorageRemoveItemReqParams, StorageRemoveItemResData, StorageSetItemReqParams, StorageSetItemResData } from '@nicepkg/gpt-runner-shared/common'
import { StorageClearReqParamsSchema, StorageGetItemReqParamsSchema, StorageRemoveItemReqParamsSchema, StorageSetItemReqParamsSchema } from '@nicepkg/gpt-runner-shared/common'
import type { ControllerConfig } from '../types'

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
        const value = await storage.get(key)

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

        await storage.set(key, value)

        sendSuccessResponse(res, {
          data: null satisfies StorageSetItemResData,
        })
      },
    },
    {
      url: '/',
      method: 'delete',
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
