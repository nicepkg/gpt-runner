package cn.nicepkg.gptrunner.intellij.listeners.handler

import cn.nicepkg.gptrunner.intellij.listeners.ClientEventName
import com.google.gson.Gson
import com.google.gson.JsonArray
import com.google.gson.JsonElement
import com.intellij.openapi.project.Project
import com.intellij.ui.jcef.JBCefJSQuery
import java.util.*
import kotlin.collections.HashMap

/**
 * handle browser events
 */
class BrowserEventHandlers(project: Project) : BaseBrowserEventHandler<String>(project) {

  private val handlers: HashMap<String, BaseBrowserEventHandler<JsonElement>> = HashMap()

  @Volatile
  var initFlag: Boolean = false

  override fun apply(t: String): JBCefJSQuery.Response {
    if (!initFlag) {
      synchronized(this) {
        if (!initFlag) {
          handlers[ClientEventName.InsertCodes.value] = CodeReplaceHandler(project)
        }
        initFlag = true
      }
    }

    val gson = Gson()
    val any = gson.fromJson(t, Any::class.java)
    if (any is JsonArray) {
      val eventName = any.get(0)
      if (handlers.contains(eventName.asString)){
        return handlers.get(eventName.asString)!!.apply(any.get(1))
      }
    }

    return JBCefJSQuery.Response("Done")
  }


}
