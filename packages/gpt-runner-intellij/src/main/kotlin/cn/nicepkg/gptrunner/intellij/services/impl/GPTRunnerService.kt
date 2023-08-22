package cn.nicepkg.gptrunner.intellij.services.impl

import cn.nicepkg.gptrunner.intellij.services.AbstractService
import cn.nicepkg.gptrunner.intellij.services.IGPTRunnerExecutableService
import cn.nicepkg.gptrunner.intellij.services.IGPTRunnerService
import com.intellij.codeInsight.hint.HintManager
import com.intellij.ide.DataManager
import com.intellij.notification.NotificationDisplayType
import com.intellij.notification.NotificationGroup
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.components.service
import com.intellij.openapi.diagnostic.thisLogger
import com.intellij.openapi.fileEditor.FileEditorManager
import com.intellij.openapi.project.Project
import com.intellij.openapi.project.ProjectManager
import kotlinx.coroutines.*
import java.io.File
import kotlin.concurrent.thread
import com.intellij.openapi.actionSystem.CommonDataKeys


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
    println("node start!")
    if (process?.isAlive == true || _isStarted) return
    //here we unzip or create.
    runBlocking {
      val getMyNodePath = getMyNodePath();
      if (getMyNodePath.isNullOrEmpty()) {
        println("oh-nodePath error: $getMyNodePath")
      } else {
      println("oh-nodePath: $getMyNodePath")
      process = ProcessBuilder(
        getMyNodePath,
        "start-server.cjs",
        "--port",
        port.toString(),
        "--client-dist-path",
        "browser"
      ).directory(executableService.gptRunnerExecutableDir.toFile())  // Update this line
        .start()
//        val serverExecutablePath = executableService.gptRunnerExecutableDir.toFile().path+"/server-executable";
//        process = ProcessBuilder(
//          serverExecutablePath,
//          "--port",
//          port.toString(),
//          "--client-dist-path",
//          "browser"
//        ).directory(executableService.gptRunnerExecutableDir.toFile())  // Update this line
//          .start()

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
  }

  override suspend fun closeNodeServer() {
    println("service close!")
    inputFlowJob?.cancel()
    errorFlowJob?.cancel()
    process?.destroyForcibly()
    _isStarted = false
  }

  override fun dispose() {
    Runtime.getRuntime().removeShutdownHook(shutdownHook)
    runBlocking { closeNodeServer() }
  }


  fun getMyNodePath(): String {
    val osName = System.getProperty("os.name").toLowerCase()
    if (osName.contains("mac") || osName.contains("nix") || osName.contains("nux")) {
      val nodePath = getNodePath()
      if (nodePath != null) {
        println("Found node at: $nodePath")
        return nodePath;
      } else {
        println("Node not found")
      }
      return "/usr/local/bin/node" // macOS, Linux默认路径
    } else if (osName.contains("win")) {
      val commonPathsWindows = listOf("C:/Program Files/nodejs", "C:/Program Files (x86)/nodejs")
      for (path in commonPathsWindows) {
        val nodePath = "$path/node.exe"
        if (File(nodePath).exists()) {
          return nodePath
        }
      }

      return "C:/Program Files/nodejs/node.exe" // Windows默认路径
    } else {
      throw UnsupportedOperationException("Unsupported OS: $osName")
    }
  }

  val commonPathsWindows = listOf("C:/Program Files/nodejs", "C:/Program Files (x86)/nodejs")
  val commonPaths = listOf("/usr/local/bin", "/usr/bin", "/bin")
  fun getNodePathWindows(): String? {
    for (path in commonPathsWindows) {
      val nodePath = "$path/node.exe"
      if (File(nodePath).exists()) {
        return nodePath
      }
    }
    return null
  }

  fun getNodePath(): String? {
    for (path in commonPaths) {
      val nodePath = "$path/node"
      if (File(nodePath).exists()) {
        return nodePath
      }
    }
    return null
  }

  // 在插件初始化或类中创建通知组
  private val NOTIFICATION_GROUP = NotificationGroup(
    "NodeJSNotFound",
    NotificationDisplayType.BALLOON,
    true
  )

}
