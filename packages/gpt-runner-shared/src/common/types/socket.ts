import type { Socket as BrowserSocket } from 'socket.io-client'
import type { Socket as NodeServerSocket } from 'socket.io'
import type { MaybePromise } from './common'
import type { WssActionName } from './enum'

import type {
  BaseResponse,
  StorageClearReqParams,
  StorageClearResData,
  StorageGetItemReqParams,
  StorageGetItemResData,
  StorageRemoveItemReqParams,
  StorageRemoveItemResData,
  StorageSetItemReqParams,
  StorageSetItemResData,
} from './server'

export interface IWssActionNameRequestMap extends Record<WssActionName, {
  reqParams?: Record<string, any>
  resData?: any
}> {
  [WssActionName.Error]: {
    reqParams?: {
      error: Error
    }
    resData?: Error
  }

  [WssActionName.StorageGetItem]: {
    reqParams?: StorageGetItemReqParams
    resData?: StorageGetItemResData
  }

  [WssActionName.StorageSetItem]: {
    reqParams?: StorageSetItemReqParams
    resData?: StorageSetItemResData
  }

  [WssActionName.StorageRemoveItem]: {
    reqParams?: StorageRemoveItemReqParams
    resData?: StorageRemoveItemResData
  }

  [WssActionName.StorageClear]: {
    reqParams?: StorageClearReqParams
    resData?: StorageClearResData
  }
}

export type WssActionNameRequestMap = {
  [K in keyof IWssActionNameRequestMap]: {
    __id__?: string
    reqParams?: IWssActionNameRequestMap[K]['reqParams']
    res?: BaseResponse<IWssActionNameRequestMap[K]['resData']>
  }
}

export type WssEventsMap = {
  [K in keyof WssActionNameRequestMap]: (message: WssActionNameRequestMap[K]) => MaybePromise<void>;
}

// export type NodeServerSocket = InstanceType<typeof Server<WssEventsMap>>
// export type BrowserSocket = InstanceType<typeof ClientSocket<WssEventsMap>>
// export type Socket = NodeServerSocket | BrowserSocket

export type { BrowserSocket, NodeServerSocket }
export type Socket = BrowserSocket | NodeServerSocket
