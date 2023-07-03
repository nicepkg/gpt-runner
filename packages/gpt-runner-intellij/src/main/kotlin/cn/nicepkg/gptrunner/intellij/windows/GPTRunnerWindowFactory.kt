package cn.nicepkg.gptrunner.intellij.windows

import cn.nicepkg.gptrunner.intellij.services.IGPTRunnerExecutableService
import cn.nicepkg.gptrunner.intellij.services.IGPTRunnerService
import com.intellij.ide.ui.LafManagerListener
import com.intellij.ide.ui.laf.UIThemeBasedLookAndFeelInfo
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.components.service
import com.intellij.openapi.components.services
import com.intellij.openapi.diagnostic.thisLogger
import com.intellij.openapi.project.Project
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
    service<IGPTRunnerExecutableService>()

    val gptRunnerWindow =
      GPTRunnerToolWindow(project, window)
    val content = ContentFactory.getInstance().createContent(
      gptRunnerWindow.getContent(),
      null,
      true
    )
    ApplicationManager.getApplication().messageBus.connect(window.disposable)
      .subscribe(LafManagerListener.TOPIC, LafManagerListener {
        val isDark =
          (it.currentLookAndFeel as UIThemeBasedLookAndFeelInfo).theme.isDark
        gptRunnerWindow.jBCefBrowser.executeJavaScriptAsync("document.body.dataset.theme = `${if (isDark) "jetbrainsDark" else "jetbrainsLight"}`")
      })
    window.contentManager.addContent(content)
  }

  override fun shouldBeAvailable(project: Project) = true

  class GPTRunnerToolWindow(project: Project, toolWindow: ToolWindow) {
    val jBCefBrowser =
      JBCefBrowser("http://localhost:${project.service<IGPTRunnerService>().port}/#/chat?rootPath=${project.basePath}").apply {
//        openDevtools()
      }

    fun getContent() = jBCefBrowser.component
  }
}
