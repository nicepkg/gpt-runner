package cn.nicepkg.gptrunner.intellij.services

import com.intellij.ide.plugins.PluginManagerCore
import com.intellij.openapi.extensions.PluginId

abstract class AbstractService {
  val pluginId = "cn.nicepkg.gptrunner.intellij"
  val plugin = PluginManagerCore.getPlugin(PluginId.getId(pluginId))!!
}
