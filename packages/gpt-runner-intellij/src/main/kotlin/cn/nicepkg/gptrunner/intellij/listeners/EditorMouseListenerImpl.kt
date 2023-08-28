package cn.nicepkg.gptrunner.intellij.listeners

import cn.nicepkg.gptrunner.intellij.listeners.publish.AppEventPublisher
import com.intellij.openapi.editor.event.EditorMouseEvent
import com.intellij.openapi.editor.event.EditorMouseListener
import com.intellij.openapi.editor.impl.EditorImpl
import java.util.regex.Pattern

/**
 * monitor selected text
 */
class EditorMouseListenerImpl : EditorMouseListener {

  override fun mouseReleased(event: EditorMouseEvent) {
    super.mouseReleased(event)
    val selectedText = event.editor.selectionModel.getSelectedText()
    val length = selectedText?.trim()?.length
    if (length != null && length > 0) {
      // Markdown format
      val editorImpl = event.editor as EditorImpl
      val fileExtension = getFileExtension(editorImpl.virtualFile.name)
      val fullPrompt = getFullPrompt(fileExtension, selectedText)

      // send
      AppEventPublisher.updateUserSelectedText(fullPrompt)
    }
  }


  private fun getFileExtension(filename: String): String {
    val pattern = Pattern.compile("[^.]+$")
    val matcher = pattern.matcher(filename)
    if (matcher.find()) {
      return matcher.group()
    }
    return ""
  }

  private fun getFullPrompt(fileExtension: String?, selectedText: String): String {
    return String.format("\n```%s\n%s\n```", fileExtension, selectedText)
  }
}
