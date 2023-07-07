package cn.nicepkg.gptrunner.intellij.ui.windows

import cn.nicepkg.gptrunner.intellij.services.IGPTRunnerExecutableService
import cn.nicepkg.gptrunner.intellij.services.IGPTRunnerService
import com.intellij.ide.ui.LafManagerListener
import com.intellij.ide.ui.laf.UIThemeBasedLookAndFeelInfo
import com.intellij.openapi.Disposable
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.components.service
import com.intellij.openapi.components.services
import com.intellij.openapi.diagnostic.thisLogger
import com.intellij.openapi.project.Project
import com.intellij.openapi.util.BusyObject
import com.intellij.openapi.util.Disposer
import com.intellij.openapi.wm.ToolWindow
import com.intellij.openapi.wm.ToolWindowFactory
import com.intellij.ui.content.ContentFactory
import com.intellij.ui.jcef.JBCefBrowser
import com.intellij.ui.jcef.executeJavaScriptAsync
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

class GPTRunnerWindowFactory : ToolWindowFactory {

  init {
    thisLogger().info("GPTRunnerWindowFactory init.")
  }

  override fun createToolWindowContent(project: Project, window: ToolWindow) {
    val gptRunnerWindow = GPTRunnerWindow(project, window.disposable)
    val content = ContentFactory.getInstance().createContent(
      gptRunnerWindow.getContent(), null, true
    )
    window.contentManager.addContent(content)
  }

  override fun shouldBeAvailable(project: Project) = true
}
