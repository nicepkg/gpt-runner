export enum ChatRole {
  User = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export enum ChatMessageStatus {
  Idle = 'idle',
  Pending = 'pending',
  Success = 'success',
  Error = 'error',
}

export enum ClientEventName {
  AddMessageAction = 'add-message-action',
}

export enum GptFileTreeItemType {
  Folder = 'folder',
  File = 'file',
  Chat = 'chat',
}
