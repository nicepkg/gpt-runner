package cn.nicepkg.gptrunner.intellij.ui.windows


import cn.nicepkg.gptrunner.intellij.services.IGPTRunnerService
import com.intellij.ide.ui.LafManagerListener
import com.intellij.ide.ui.laf.UIThemeBasedLookAndFeelInfo
import com.intellij.openapi.Disposable
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.components.service
import com.intellij.openapi.project.Project
import com.intellij.ui.jcef.JBCefBrowser
import com.intellij.ui.jcef.JBCefClient
import com.intellij.ui.jcef.executeJavaScriptAsync

class GPTRunnerWindow(project: Project, disposable: Disposable) {
  private val jBCefBrowser =
    JBCefBrowser("http://localhost:${project.service<IGPTRunnerService>().port}/#/chat?rootPath=${project.basePath}").apply {}


  init {
    println("init windows")
    println("project.basePath=" + project.basePath)
    val messageBusConnection = ApplicationManager.getApplication().messageBus.connect(disposable)
    messageBusConnection
      .subscribe(LafManagerListener.TOPIC, LafManagerListener {
        val isDark =
          (it.currentLookAndFeel as UIThemeBasedLookAndFeelInfo).theme.isDark
        jBCefBrowser.executeJavaScriptAsync("document.body.dataset.theme = `${if (isDark) "jetbrainsDark" else "jetbrainsLight"}`")
      })

//      window.setAdditionalGearActions()
//    jBCefBrowser.jbCefClient.setProperty(JBCefClient.Properties.JS_QUERY_POOL_SIZE, 3)

  }

  fun getContent() = jBCefBrowser.component

  fun getBrowser() = jBCefBrowser
}
