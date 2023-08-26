package cn.nicepkg.gptrunner.intellij.ui.windows

import com.intellij.ui.jcef.JBCefBrowser
import com.intellij.ui.jcef.JBCefJSQuery

class GPTRunnerWindowHolder {

  companion object {
    var jsQuery: JBCefJSQuery? = null
    var jBCefBrowser: JBCefBrowser? = null
  }

}
