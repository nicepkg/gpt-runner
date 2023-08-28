package cn.nicepkg.gptrunner.intellij.listeners.publish

import cn.nicepkg.gptrunner.intellij.listeners.ClientEventName
import cn.nicepkg.gptrunner.intellij.ui.windows.GPTRunnerWindowHolder
import com.google.gson.JsonObject

/**
 * push event to web
 */
class AppEventPublisher {

  companion object {


    fun updateUserSelectedText(text: String) {
      val jsonObject = JsonObject()
      jsonObject.addProperty("text", text)

      publish(ClientEventName.UpdateUserSelectedText.value, jsonObject)
    }


    private fun publish(eventName: String, eventData: JsonObject) {
      GPTRunnerWindowHolder.jBCefBrowser!!.cefBrowser.executeJavaScript(
        "window.__emitter__.emit( \"${eventName}\", $eventData )",
        null,
        0
      )
    }
  }

}
