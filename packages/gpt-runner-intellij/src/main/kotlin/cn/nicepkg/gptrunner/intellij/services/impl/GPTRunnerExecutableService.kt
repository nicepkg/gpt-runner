package cn.nicepkg.gptrunner.intellij.services.impl

import cn.nicepkg.gptrunner.intellij.services.AbstractService
import cn.nicepkg.gptrunner.intellij.services.IGPTRunnerExecutableService
import org.apache.commons.lang3.SystemUtils
import java.io.File
import java.net.HttpURLConnection
import java.net.URL
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
  override val gptRunnerExecutableDir = gptRunnerExecutablesDir.resolve("GPT-Runner-${plugin.version}")

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

  private fun unzipGPTRunnerExecutableFromUrl() {
    val url = URL("http://localhost:8989/dist.zip")
    val connection = url.openConnection() as HttpURLConnection
    connection.requestMethod = "GET"

    try {
      if (connection.responseCode == HttpURLConnection.HTTP_OK) {
        println("Downloading dist.zip")
        connection.inputStream.use { inputStream ->
          ZipInputStream(inputStream).use { zis ->
            var nextEntry: ZipEntry? = zis.nextEntry
            while (nextEntry != null) {
              val name: String = nextEntry.name
              val isDir = nextEntry.isDirectory

              val toFile = gptRunnerExecutableDir.resolve(name).normalize()
              if (isDir && !toFile.exists()) {
                toFile.toFile().mkdirs()
              } else {
                if (!toFile.parent.toFile().exists()) toFile.parent.toFile().mkdirs()
                Files.copy(zis, toFile, StandardCopyOption.REPLACE_EXISTING)
              }

              zis.closeEntry()
              nextEntry = zis.nextEntry
            }
          }
        }
      } else {
        println("Failed to download dist.zip. Response code: ${connection.responseCode}")
      }
    } catch (e: Exception) {
      println("An error occurred while downloading or unzipping the file. Error: ${e.message}")
    }
  }


  private fun unzipMyGPTRunnerExecutable() {
    ZipInputStream(javaClass.getResourceAsStream("/dist.zip")!!).use { zis ->
      var entry: ZipEntry? = zis.nextEntry
      while (entry != null) {
        val filePathStr = entry.name.removePrefix("dist/")
        val fileToWrite = gptRunnerExecutableDir.resolve(filePathStr)

        if (entry.isDirectory) {
          if (!fileToWrite.exists()) {
            Files.createDirectories(fileToWrite)
          }
        } else {
          // Make sure that parent directory exists
          Files.createDirectories(fileToWrite.parent)
          // Write the file
          Files.copy(zis, fileToWrite, StandardCopyOption.REPLACE_EXISTING)
        }

        entry = zis.nextEntry
      }
    }
  }
}
