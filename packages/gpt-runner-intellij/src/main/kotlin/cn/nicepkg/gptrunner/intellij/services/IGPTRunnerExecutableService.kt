package cn.nicepkg.gptrunner.intellij.services

import java.nio.file.Path

interface IGPTRunnerExecutableService {
  val userHome: Path
  val gptRunnerExecutablesDir: Path
  val gptRunnerExecutableDir: Path
}
