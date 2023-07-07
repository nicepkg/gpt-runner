package cn.nicepkg.gptrunner.intellij.services.impl

import cn.nicepkg.gptrunner.intellij.services.AbstractService
import cn.nicepkg.gptrunner.intellij.services.IGPTRunnerExecutableService
import cn.nicepkg.gptrunner.intellij.services.IGPTRunnerService
import com.intellij.openapi.components.service
import com.intellij.openapi.diagnostic.thisLogger
import com.intellij.openapi.project.Project
import kotlinx.coroutines.*
import kotlin.concurrent.thread

// TODO: 需要提供几个action去启动/停止server
class GPTRunnerService(project: Project) : AbstractService(),
  IGPTRunnerService {

  private val executableService = service<IGPTRunnerExecutableService>()

  private var process: Process? = null
  private var inputFlowJob: Job? = null
  private var errorFlowJob: Job? = null

  private var _port = 13000
  override val port: Int
    get() = _port

  private val shutdownHook = thread(false) {
    runBlocking { closeNodeServer() }
  }

  init {
    println("oh!")
    Runtime.getRuntime().addShutdownHook(shutdownHook)
  }

  private var _isStarted = false

  @OptIn(ObsoleteCoroutinesApi::class)
  override suspend fun startNodeServer() {
    if (process?.isAlive == true || _isStarted) return
    runBlocking {
      process = ProcessBuilder(
        "node",
        "start-server.mjs",
        "--port",
        port.toString(),
        "--client-dist-path",
        "browser"
      ).directory(executableService.gptRunnerExecutableDir.toFile())
        .start()
      _isStarted = true

      inputFlowJob =
        launch(newSingleThreadContext("processInputFlowJob${process!!.pid()}")) {
          val inputReader = process?.inputReader()
          while (process?.isAlive == true && inputReader != null) {
            val line = inputReader.readLines()
            thisLogger().info("process input line:  $line")
          }
        }
      errorFlowJob =
        launch(newSingleThreadContext("processErrorFlowJob${process!!.pid()}")) {
          val errorReader = process?.errorReader()
          while (process?.isAlive == true && errorReader != null) {
            val line = errorReader.readLines()
            thisLogger().info("process input line:  $line")
          }
        }

      process!!.onExit().whenCompleteAsync { t, u ->
        val err = t.errorReader().readText()
        thisLogger().info("process exit value: ${t.exitValue()}")
        thisLogger().error(err, u)
        if (err.contains("address already in use")) {
          _port++
          runBlocking { startNodeServer() }
          return@whenCompleteAsync
        }
        runBlocking { closeNodeServer() }
      }
    }
  }

  override suspend fun closeNodeServer() {
    inputFlowJob?.cancel()
    errorFlowJob?.cancel()
    process?.destroyForcibly()
    _isStarted = false
  }

  override fun dispose() {
    Runtime.getRuntime().removeShutdownHook(shutdownHook)
    runBlocking { closeNodeServer() }
  }
}
