export const enum ClientEventName {
  SyncState = 'sync-state',
  SetIsReady = 'set-is-ready',
  SetHasSelection = 'set-has-selection',
  AddMessageAction = 'add-message-action',
  UpdateMessageAction = 'update-message-action',
  ClearMessageAction = 'clear-message-action',
  ConfirmPrompt = 'confirm-prompt',
  InsertCodeSnippet = 'insert-code-snippet',
}

export * from './types'
