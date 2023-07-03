import type { ClientEventName } from './enum'

export interface ClientEventData {
  [ClientEventName.InitSuccess]: void

  [ClientEventName.RefreshTree]: void

  [ClientEventName.RefreshChatTree]: void

  [ClientEventName.RefreshFileTree]: void

  [ClientEventName.InsertCodes]: {
    codes: string
  }

  [ClientEventName.DiffCodes]: {
    codes: string
  }

  [ClientEventName.UpdateIdeOpeningFiles]: {
    filePaths: string[]
  }

  [ClientEventName.UpdateIdeActiveFilePath]: {
    filePath: string
  }

  [ClientEventName.UpdateUserSelectedText]: {
    text: string
  }
}

export type EventEmitterMap = {
  [K in ClientEventName]: (data: ClientEventData[K]) => any
}
