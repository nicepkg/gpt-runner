package cn.nicepkg.gptrunner.intellij.services

import com.intellij.openapi.Disposable
import com.intellij.openapi.project.Project
import org.apache.commons.lang3.SystemUtils

interface IGPTRunnerService : Disposable {
  val port: Int
  suspend fun startNodeServer()
  suspend fun closeNodeServer()
}
