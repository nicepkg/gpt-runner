export enum ChatModelType {
  Openai = 'openai',
}

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
  RefreshTree = 'refreshTree',
  InsertCodes = 'insertCodes',
  DiffCodes = 'diffCodes',
}

export enum GptFileTreeItemType {
  Folder = 'folder',
  File = 'file',
  Chat = 'chat',
}

export enum ServerStorageName {
  FrontendState = 'frontend-state',
  SecretsConfig = 'secrets-config',
  WebPreset = 'web-preset',
}

export enum WssActionName {
  Error = 'error',
  StorageGetItem = 'storageGetItem',
  StorageSetItem = 'storageSetItem',
  StorageRemoveItem = 'storageRemoveItem',
  StorageClear = 'storageClear',
}
