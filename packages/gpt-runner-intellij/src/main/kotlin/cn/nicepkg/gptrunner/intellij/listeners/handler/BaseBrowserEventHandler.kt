package cn.nicepkg.gptrunner.intellij.listeners.handler

import com.intellij.openapi.project.Project
import com.intellij.ui.jcef.JBCefJSQuery

abstract class BaseBrowserEventHandler<T>(val project: Project) : java.util.function.Function<T, JBCefJSQuery.Response> {


}
