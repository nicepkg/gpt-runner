package cn.nicepkg.gptrunner.intellij.listeners.publish

import cn.nicepkg.gptrunner.intellij.listeners.ClientEventName
import kotlinx.serialization.Serializable


@Serializable
class AppEvent(value: String?, eventData: Any?, type: String?) {

  private val eventName: String? = null
  private val type: String? = null
  private val eventData: Any? = null


  private var text: String? = null
  private val codes: String? = null

  companion object {
    fun of(eventName: ClientEventName, eventData: Any, type: String): AppEvent {
      return AppEvent(eventName.value, eventData, type)
    }

    fun of(text: String): AppEvent {
      val event = AppEvent()
      event.text = text
      return event
    }
  }

  constructor() : this(null, null, null)

}
