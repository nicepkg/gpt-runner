export const enum ChatRole {
  User = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export const enum ChatMessageStatus {
  Idle = 'idle',
  Pending = 'pending',
  Success = 'success',
  Error = 'error',
}

export const enum ClientEventName {
  AddMessageAction = 'add-message-action',
}

export const enum GptFileTreeItemType {
  Folder = 'folder',
  File = 'file',
  Chat = 'chat',
}
