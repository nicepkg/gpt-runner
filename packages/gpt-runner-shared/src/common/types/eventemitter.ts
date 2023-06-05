import type { ClientEventName } from './enum'

export interface ClientEventData {
  [ClientEventName.InsertCodes]: {
    codes: string
  }

  [ClientEventName.DiffCodes]: {
    codes: string
  }
}

export type EventEmitterMap = {
  [K in ClientEventName]: (data: ClientEventData[K]) => void
}
