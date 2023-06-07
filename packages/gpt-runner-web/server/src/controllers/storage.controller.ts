import { getStorage, sendSuccessResponse, verifyParamsByZod } from '@nicepkg/gpt-runner-shared/node'
import type { GetStorageReqParams, GetStorageResData, SaveStorageReqParams, SaveStorageResData } from '@nicepkg/gpt-runner-shared/common'
import { GetStorageReqParamsSchema, SaveStorageReqParamsSchema } from '@nicepkg/gpt-runner-shared/common'
import type { ControllerConfig } from '../types'

export const storageControllers: ControllerConfig = {
  namespacePath: '/storage',
  controllers: [
    {
      url: '/',
      method: 'get',
      handler: async (req, res) => {
        const query = req.query as GetStorageReqParams

        verifyParamsByZod(query, GetStorageReqParamsSchema)

        const { key, storageName } = query

        const { storage, cacheDir } = await getStorage(storageName)
        const value = await storage.get(key)

        sendSuccessResponse(res, {
          data: {
            value,
            cacheDir,
          } satisfies GetStorageResData,
        })
      },
    },
    {
      url: '/',
      method: 'post',
      handler: async (req, res) => {
        const body = req.body as SaveStorageReqParams

        verifyParamsByZod(body, SaveStorageReqParamsSchema)

        const { storageName, key, value } = body

        const { storage } = await getStorage(storageName)

        switch (value) {
          case undefined:
            // remove
            await storage.delete(key)
            break
          default:
            // set
            await storage.set(key, value)
            break
        }

        sendSuccessResponse(res, {
          data: null satisfies SaveStorageResData,
        })
      },
    },
  ],
}
