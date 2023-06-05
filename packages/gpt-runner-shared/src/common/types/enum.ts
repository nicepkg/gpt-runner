export enum ChatRole {
  User = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export enum ChatMessageStatus {
  Pending = 'pending',
  Success = 'success',
  Error = 'error',
}

export enum ClientEventName {
  InsertCodes = 'insertCodes',
  DiffCodes = 'diffCodes',
}

export enum GptFileTreeItemType {
  Folder = 'folder',
  File = 'file',
  Chat = 'chat',
}
