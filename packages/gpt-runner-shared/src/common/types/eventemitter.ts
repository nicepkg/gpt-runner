import type { ClientEventName } from './enum'

export interface ClientEventData {
  [ClientEventName.AddMessageAction]: void
}
