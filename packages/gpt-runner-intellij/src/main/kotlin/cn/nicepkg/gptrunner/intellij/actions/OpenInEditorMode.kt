package cn.nicepkg.gptrunner.intellij.actions

import com.intellij.openapi.actionSystem.ActionUpdateThread
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent

// TODO: impl it
class OpenInEditorMode : AnAction() {
  override fun actionPerformed(e: AnActionEvent) {
    if (e.project == null) return
//    val project = e.project!!
//    val gptRunnerService = project.service<IGPTRunnerService>()
//    project.projectFile
  }

  override fun update(e: AnActionEvent) {
    e.presentation.isEnabled = e.project != null
    super.update(e)
  }

  override fun getActionUpdateThread(): ActionUpdateThread {
    return ActionUpdateThread.EDT
  }
}
