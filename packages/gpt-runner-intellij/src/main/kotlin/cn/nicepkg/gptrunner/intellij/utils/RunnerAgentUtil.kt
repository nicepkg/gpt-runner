package cn.nicepkg.gptrunner.intellij.utils

import cn.nicepkg.gptrunner.intellij.services.IGPTRunnerExecutableService
import com.intellij.openapi.application.ApplicationManager
import java.nio.file.Path

object RunnerAgentUtil {


  fun agentDirectoryPath(): Path {
    val executableService = ApplicationManager.getApplication().getService(IGPTRunnerExecutableService::class.java)
    return executableService.gptRunnerExecutableDir.resolve("dist")
  }

}
