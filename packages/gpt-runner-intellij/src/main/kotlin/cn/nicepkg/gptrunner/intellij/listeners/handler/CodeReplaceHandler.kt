package cn.nicepkg.gptrunner.intellij.listeners.handler

import com.google.gson.JsonElement
import com.google.gson.JsonObject
import com.intellij.openapi.fileEditor.FileEditorManager
import com.intellij.openapi.project.Project
import com.intellij.ui.jcef.JBCefJSQuery

/**
 * TODO 验证
 *
 * @author shield
 */
class CodeReplaceHandler(project: Project) : BaseBrowserEventHandler<JsonElement>(project) {

  override fun apply(t: JsonElement): JBCefJSQuery.Response {
    val editor = FileEditorManager.getInstance(project).getSelectedTextEditor()
    if (editor != null) {
      val selectionModel = editor.selectionModel

      if (t is JsonObject && t.has("codes")) {
        val content = t.get("codes").asString
        editor.document.replaceString(selectionModel.selectionStart, selectionModel.selectionEnd, content)
      }
    }

    return JBCefJSQuery.Response("Done")
  }
}
