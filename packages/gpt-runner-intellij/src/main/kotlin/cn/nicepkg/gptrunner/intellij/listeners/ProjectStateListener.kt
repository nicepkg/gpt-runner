package cn.nicepkg.gptrunner.intellij.listeners

import cn.nicepkg.gptrunner.intellij.services.IGPTRunnerService
import com.intellij.ide.impl.isTrusted
import com.intellij.openapi.components.service
import com.intellij.openapi.diagnostic.thisLogger
import com.intellij.openapi.project.Project
import com.intellij.openapi.project.ProjectManagerListener
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import kotlin.concurrent.thread

class ProjectStateListener : ProjectManagerListener {
  override fun projectOpened(project: Project) {
    thisLogger().debug("project: ${project.name}")
    thisLogger().debug("project.isInitialized: ${project.isInitialized}")
    thisLogger().debug("project.isOpen: ${project.isOpen}")
    thread {
      runBlocking {
        project.service<IGPTRunnerService>().startNodeServer()
      }
    }
    super.projectOpened(project)
  }

  override fun projectClosed(project: Project) {
    runBlocking { project.service<IGPTRunnerService>().closeNodeServer() }
    super.projectClosed(project)
  }
}
