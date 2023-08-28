package cn.nicepkg.gptrunner.intellij.ui.windows

import cn.nicepkg.gptrunner.intellij.listeners.ClientEventName
import cn.nicepkg.gptrunner.intellij.listeners.handler.BrowserEventHandlers
import com.google.gson.Gson
import com.google.gson.JsonArray
import com.intellij.openapi.diagnostic.thisLogger
import com.intellij.openapi.fileEditor.FileEditorManager
import com.intellij.openapi.project.Project
import com.intellij.openapi.wm.ToolWindow
import com.intellij.openapi.wm.ToolWindowFactory
import com.intellij.ui.content.ContentFactory
import com.intellij.ui.jcef.JBCefBrowserBase
import com.intellij.ui.jcef.JBCefJSQuery
import org.cef.browser.CefBrowser
import org.cef.browser.CefFrame
import org.cef.handler.CefLoadHandler
import org.cef.network.CefRequest

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
    val jbCefBrowser = gptRunnerWindow.getBrowser()
    val jsQuery = JBCefJSQuery.create(jbCefBrowser as JBCefBrowserBase)

    jsQuery.addHandler { t ->
      println("监听js传参 $t")

      BrowserEventHandlers(project).apply(t)
    }


    jbCefBrowser.jbCefClient.addLoadHandler(object : CefLoadHandler {
      override fun onLoadingStateChange(browser: CefBrowser?, isLoading: Boolean, canGoBack: Boolean, canGoForward: Boolean) {
      }

      override fun onLoadStart(browser: CefBrowser?, frame: CefFrame?, transitionType: CefRequest.TransitionType?) {
      }

      override fun onLoadEnd(browser: CefBrowser?, frame: CefFrame?, httpStatusCode: Int) {
        println("onLoadEnd" + frame?.url)

        browser?.executeJavaScript(
          "window.addEventListener('message', event => {\n" +
            "const message = event.data || {};\n" +
            "console.log(event)\n" +
            "const {eventName, eventData} = message\n" +
            "const strEvent = JSON.stringify(message) \n" +
//            jsQuery.inject("strEvent") +
            "window.__emitter__.emit(eventName, eventData, \"ReceiveMessage\")" +
            "      })",
          null,
          0
        )

        browser?.executeJavaScript(
          "oldEmit = window.__emitter__.emit\n" +
            "      window.__emitter__.emit = function (...args) {\n" +
            "        const [eventName, eventData, type] = args\n" +
            "        if (type !== \"ReceiveMessage\") {\n" +
            "        const strEvent = JSON.stringify(args) \n" +
            jsQuery.inject("strEvent") +
            "        }\n" +
            "        return oldEmit.apply(this, args)\n" +
            "      }",
          null,
          1
        )

      }

      override fun onLoadError(browser: CefBrowser?, frame: CefFrame?, errorCode: CefLoadHandler.ErrorCode?, errorText: String?, failedUrl: String?) {
      }

    }, gptRunnerWindow.getBrowser().cefBrowser)

    GPTRunnerWindowHolder.jBCefBrowser = jbCefBrowser
    GPTRunnerWindowHolder.jsQuery = jsQuery
  }

  override fun shouldBeAvailable(project: Project) = true

  override fun init(toolWindow: ToolWindow) {
    super.init(toolWindow)
  }
}
