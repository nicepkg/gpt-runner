package cn.nicepkg.gptrunner.intellij.ui.windows


import cn.nicepkg.gptrunner.intellij.services.IGPTRunnerService
import com.intellij.ide.plugins.PluginManager
import com.intellij.ide.ui.LafManager
import com.intellij.ide.ui.LafManagerListener
import com.intellij.ide.ui.laf.UIThemeBasedLookAndFeelInfo
import com.intellij.openapi.Disposable
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.components.service
import com.intellij.openapi.extensions.PluginId
import com.intellij.openapi.project.Project
import com.intellij.ui.jcef.JBCefBrowser
import com.intellij.ui.jcef.JBCefBrowserBuilder
import com.intellij.ui.jcef.executeJavaScriptAsync
import java.io.IOException
import java.nio.file.Files
import java.nio.file.Paths
import java.util.*
import java.util.zip.ZipEntry
import java.util.zip.ZipFile
import javax.swing.JComponent

class GPTRunnerWindow(project: Project, disposable: Disposable) {
  private val jBCefBrowser =
    JBCefBrowser("http://localhost:${project.service<IGPTRunnerService>().port}/#/chat?rootPath=${project.basePath}").apply {}


  init {
    println("init windows")
    println("project.basePath="+project.basePath)
    ApplicationManager.getApplication().messageBus.connect(disposable)
      .subscribe(LafManagerListener.TOPIC, LafManagerListener {
        val isDark =
          (it.currentLookAndFeel as UIThemeBasedLookAndFeelInfo).theme.isDark
        jBCefBrowser.executeJavaScriptAsync("document.body.dataset.theme = `${if (isDark) "jetbrainsDark" else "jetbrainsLight"}`")
      })
//      window.setAdditionalGearActions();
  }

  fun getContent() = jBCefBrowser.component
}
