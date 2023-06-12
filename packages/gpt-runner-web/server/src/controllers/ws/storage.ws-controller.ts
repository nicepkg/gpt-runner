import type { StorageClearResData, StorageGetItemReqParams, StorageGetItemResData, StorageRemoveItemReqParams, StorageRemoveItemResData, StorageSetItemReqParams, StorageSetItemResData } from '@nicepkg/gpt-runner-shared/common'
import { StorageClearReqParamsSchema, StorageGetItemReqParamsSchema, StorageRemoveItemReqParamsSchema, StorageSetItemReqParamsSchema, WssActionName, WssUtils, buildSuccessResponse } from '@nicepkg/gpt-runner-shared/common'
import { getStorage, verifyParamsByZod } from '@nicepkg/gpt-runner-shared/node'
import type { WssControllerConfig } from '../../types'

export const storageControllers: WssControllerConfig = {
  controllers: [
    {
      actionName: WssActionName.StorageGetItem,
      handler: async (params: StorageGetItemReqParams) => {
        verifyParamsByZod(params, StorageGetItemReqParamsSchema)

        const { key, storageName } = params

        const { storage, cacheDir } = await getStorage(storageName)
        const value = await storage.get(key)

        WssUtils.instance.emit(WssActionName.StorageGetItem, {
          reqParams: params,
          res: buildSuccessResponse({
            data: {
              value,
              cacheDir,
            } satisfies StorageGetItemResData,
          }),
        })
      },
    },
    {
      actionName: WssActionName.StorageSetItem,
      handler: async (params: StorageSetItemReqParams) => {
        verifyParamsByZod(params, StorageSetItemReqParamsSchema)

        const { storageName, key, value } = params

        const { storage } = await getStorage(storageName)
        await storage.set(key, value)

        WssUtils.instance.emit(WssActionName.StorageSetItem, {
          reqParams: params,
          res: buildSuccessResponse({
            data: null satisfies StorageSetItemResData,
          }),
        })
      },
    },
    {
      actionName: WssActionName.StorageRemoveItem,
      handler: async (params: StorageRemoveItemReqParams) => {
        verifyParamsByZod(params, StorageRemoveItemReqParamsSchema)

        const { key, storageName } = params

        const { storage } = await getStorage(storageName)
        await storage.delete(key)

        WssUtils.instance.emit(WssActionName.StorageRemoveItem, {
          reqParams: params,
          res: buildSuccessResponse({
            data: null satisfies StorageRemoveItemResData,
          }),
        })
      },
    },
    {
      actionName: WssActionName.StorageClear,
      handler: async (params) => {
        verifyParamsByZod(params, StorageClearReqParamsSchema)

        const { storageName } = params

        const { storage } = await getStorage(storageName)
        await storage.clear()

        WssUtils.instance.emit(WssActionName.StorageClear, {
          reqParams: params,
          res: buildSuccessResponse({
            data: null satisfies StorageClearResData,
          }),
        })
      },
    },
  ],
}
