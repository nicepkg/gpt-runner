package cn.nicepkg.gptrunner.intellij.services.impl

import cn.nicepkg.gptrunner.intellij.services.AbstractService
import cn.nicepkg.gptrunner.intellij.services.IGPTRunnerExecutableService
import org.apache.commons.lang3.SystemUtils
import java.io.File
import java.nio.file.Files
import java.nio.file.StandardCopyOption
import java.nio.file.attribute.FileAttribute
import java.util.zip.ZipEntry
import java.util.zip.ZipInputStream
import kotlin.io.path.*
import kotlin.reflect.jvm.internal.impl.builtins.StandardNames.FqNames.target


class GPTRunnerExecutableService : AbstractService(),
  IGPTRunnerExecutableService {
  override val userHome = SystemUtils.getUserHome().toPath()
  override val gptRunnerExecutablesDir = userHome.resolve(".gpt-runner")
  override val gptRunnerExecutableDir =
    gptRunnerExecutablesDir.resolve("GPT-Runner-${plugin.version}")

  init {
    if (gptRunnerExecutableDir.notExists()) {
      gptRunnerExecutableDir.createDirectories()
      unzipGPTRunnerExecutable()
    } else if (gptRunnerExecutableDir.listDirectoryEntries().isEmpty()) {
      unzipGPTRunnerExecutable()
    }
  }

  private fun unzipGPTRunnerExecutable() {
    ZipInputStream(javaClass.getResourceAsStream("/dist.zip")!!).use { zis ->
      var nextEntry: ZipEntry?
      while (zis.nextEntry.also { nextEntry = it } != null) {
        val name: String = nextEntry!!.name
        val isDir = nextEntry!!.isDirectory

        val toFile = gptRunnerExecutableDir.resolve(name).normalize()
        if (isDir && !toFile.exists()) {
          toFile.createDirectories()
        } else {
          if (!toFile.parent.exists()) toFile.parent.createDirectories()
          Files.copy(zis, toFile, StandardCopyOption.REPLACE_EXISTING)
        }
      }
    }
  }
}
