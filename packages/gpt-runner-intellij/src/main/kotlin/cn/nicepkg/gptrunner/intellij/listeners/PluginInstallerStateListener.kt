package cn.nicepkg.gptrunner.intellij.listeners

import cn.nicepkg.gptrunner.intellij.services.IGPTRunnerExecutableService
import com.intellij.ide.plugins.IdeaPluginDescriptor
import com.intellij.ide.plugins.PluginStateListener
import com.intellij.openapi.components.service

class PluginInstallerStateListener : PluginStateListener {
  override fun install(descriptor: IdeaPluginDescriptor) {
    service<IGPTRunnerExecutableService>()
  }

  override fun uninstall(descriptor: IdeaPluginDescriptor) {
    super.uninstall(descriptor)
  }
}
