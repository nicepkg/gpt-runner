export enum ChatModelType {
  Openai = 'openai',
  HuggingFace = 'huggingFace',
  Anthropic = 'anthropic',
}

export enum ChatRole {
  User = 'user',
  Assistant = 'assistant',
  System = 'system',
}

export enum ChatMessageStatus {
  Pending = 'pending',
  Success = 'success',
  Error = 'error',
}

export enum ClientEventName {
  InitSuccess = 'initSuccess',
  RefreshTree = 'refreshTree',
  RefreshChatTree = 'refreshChatTree',
  RefreshFileTree = 'refreshFileTree',
  InsertCodes = 'insertCodes',
  DiffCodes = 'diffCodes',
  UpdateIdeOpeningFiles = 'updateIdeOpeningFiles',
  UpdateIdeActiveFilePath = 'updateIdeActiveFilePath',
  UpdateUserSelectedText = 'updateUserSelectedText',
  OpenFileInIde = 'openFileInIde',
  OpenFileInFileEditor = 'openFileInFileEditor',
  GoToChatPanel = 'goToChatPanel',
}

export enum AiPersonTreeItemType {
  Folder = 'folder',
  File = 'file',
}

export enum ServerStorageName {
  FrontendState = 'frontend-state',
  SecretsConfig = 'secrets-config',
  GlobalState = 'global-state',
  WebPreset = 'web-preset',
}

export enum WssActionName {
  Error = 'error',
  StorageGetItem = 'storageGetItem',
  StorageSetItem = 'storageSetItem',
  StorageRemoveItem = 'storageRemoveItem',
  StorageClear = 'storageClear',
}

export enum LocaleLang {
  English = 'en',
  ChineseSimplified = 'zh_CN',
  ChineseTraditional = 'zh_Hant',
  Japanese = 'ja',
  German = 'de',
}

export enum SecretStorageKey {
  Anthropic = 'anthropic',
  HuggingFace = 'huggingFace',
  Openai = 'openai',
  Proxy = 'proxy',
}

export enum VendorTag {
  Free = 'free',
  Official = 'official',
  Unofficial = 'unofficial',
  Recommended = 'recommended',
}
