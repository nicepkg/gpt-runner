package cn.nicepkg.gptrunner.intellij.listeners

/**
 * 事件名称
 */
enum class ClientEventName(val value: String) {
  InitSuccess("initSuccess"),
  RefreshTree("refreshTree"),
  RefreshChatTree("refreshChatTree"),
  RefreshFileTree("refreshFileTree"),
  InsertCodes("insertCodes"),
  DiffCodes("diffCodes"),
  UpdateIdeOpeningFiles("updateIdeOpeningFiles"),
  UpdateIdeActiveFilePath("updateIdeActiveFilePath"),
  UpdateUserSelectedText("updateUserSelectedText"),
  OpenFileInIde("openFileInIde"),
  OpenFileInFileEditor("openFileInFileEditor"),
  GoToChatPanel("goToChatPanel")



}
