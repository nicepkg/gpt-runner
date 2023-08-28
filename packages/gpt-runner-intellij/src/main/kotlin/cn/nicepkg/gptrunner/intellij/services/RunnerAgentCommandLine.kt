package cn.nicepkg.gptrunner.intellij.services

import com.intellij.execution.configurations.PathEnvironmentVariableUtil
import com.intellij.openapi.diagnostic.Logger
import com.intellij.openapi.util.SystemInfoRt
import java.nio.file.Files
import java.nio.file.Path

object RunnerAgentCommandLine {
  private val LOG = Logger.getInstance(RunnerAgentCommandLine::class.java)

  fun getNodeExecutablePath(): Path? {
    val path = PathEnvironmentVariableUtil.findExecutableInPathOnAnyOS("node")
    if (path == null) {
      LOG.debug("在 PATH 中找不到 node 可执行文件")
      return null
    }
    val nioPath = path.toPath()
    if (SystemInfoRt.isUnix && !Files.isExecutable(nioPath)) {
      LOG.warn("node 可执行文件没有执行权限: $nioPath")
      return null
    }
    LOG.debug("在 $nioPath 找到了 node 可执行文件")
    return nioPath
  }

}
