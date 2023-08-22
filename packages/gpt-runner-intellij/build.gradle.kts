import com.github.gradle.node.pnpm.task.PnpmTask
import com.github.gradle.node.task.NodeTask
import org.jetbrains.changelog.Changelog
import org.jetbrains.changelog.markdownToHTML
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

fun properties(key: String) = providers.gradleProperty(key)
fun environment(key: String) = providers.environmentVariable(key)

plugins {
  id("java") // Java support
  alias(libs.plugins.kotlin) // Kotlin support
  alias(libs.plugins.gradleIntelliJPlugin) // Gradle IntelliJ Plugin
  alias(libs.plugins.changelog) // Gradle Changelog Plugin
  alias(libs.plugins.qodana) // Gradle Qodana Plugin
  alias(libs.plugins.kover) // Gradle Kover Plugin
  alias(libs.plugins.nodeGradle) // Gradle Node Plugin
}

group = properties("pluginGroup").get()
version = properties("pluginVersion").get()

// Configure project's dependencies
repositories {
  mavenCentral()
}

// Dependencies are managed with Gradle version catalog - read more: https://docs.gradle.org/current/userguide/platforms.html#sub:version-catalog
dependencies {
//    implementation(libs.annotations)
  implementation(libs.coroutines)
}

// Set the JVM language level used to build the project. Use Java 11 for 2020.3+, and Java 17 for 2022.2+.
kotlin {
  jvmToolchain(17)
}

// Configure Gradle IntelliJ Plugin - read more: https://plugins.jetbrains.com/docs/intellij/tools-gradle-intellij-plugin.html
intellij {
  pluginName = properties("pluginName").get()
  version = properties("platformVersion").get()
// Configure
  type = properties("platformType").get()

  // Plugin Dependencies. Uses `platformPlugins` property from the gradle.properties file.
  plugins = properties("platformPlugins").map {
    it.split(',').map(String::trim).filter(String::isNotEmpty)
  }.orElse(emptyList())

}

// Configure Gradle Changelog Plugin - read more: https://github.com/JetBrains/gradle-changelog-plugin
changelog {
  groups.empty()
  repositoryUrl = properties("pluginRepositoryUrl")
}

// Configure Gradle Qodana Plugin - read more: https://github.com/JetBrains/gradle-qodana-plugin
qodana {
  cachePath = provider { file(".qodana").canonicalPath }
  reportPath = provider { file("build/reports/inspections").canonicalPath }
  saveReport = true
  showReport =
    environment("QODANA_SHOW_REPORT").map { it.toBoolean() }.getOrElse(false)
}

// Configure Gradle Kover Plugin - read more: https://github.com/Kotlin/kotlinx-kover#configuration
koverReport {
  defaults {
    xml {
      onCheck = true
    }
  }
}

node {
  // If you don't have node installed on your computer, change it to `true`, but please be careful not to commit to git
  download = false
  // If `download` is true, `version` available.
  // version = "20"

//  nodeProjectDir.set(File("../gpt-runner-web"))
//  workDir.set(File("../gpt-runner-web"))

  nodeProjectDir.set(File("./"))
  workDir.set(File("./"))
}

val buildGPTRunnerWebClientTask = tasks.register("buildGPTRunnerWebClient", PnpmTask::class) {
  dependsOn(tasks.pnpmInstall)
  pnpmCommand.set(listOf("build:client:watch"))
}

val runGPTRunnerServerTask = tasks.register("runGPTRunnerServerTask", NodeTask::class) {
  dependsOn(tasks.pnpmInstall)
  script.set(File("../gpt-runner-web/dist/start-server.mjs"))
}

tasks.withType<JavaCompile>().configureEach {
  options.isIncremental = true
}

tasks {
  wrapper {
    gradleVersion = properties("gradleVersion").get()
  }

  patchPluginXml {
    version = properties("pluginVersion")
    sinceBuild = properties("pluginSinceBuild")
    untilBuild = properties("pluginUntilBuild")

    // Extract the <!-- Plugin description --> section from README.md and provide for the plugin's manifest
    pluginDescription =
      providers.fileContents(layout.projectDirectory.file("README.md")).asText.map {
        val start = "<!-- Plugin description -->"
        val end = "<!-- Plugin description end -->"

        with(it.lines()) {
          if (!containsAll(listOf(start, end))) {
            throw GradleException("Plugin description section not found in README.md:\n$start ... $end")
          }
          subList(indexOf(start) + 1, indexOf(end)).joinToString("\n")
            .let(::markdownToHTML)
        }
      }

    val changelog =
      project.changelog // local variable for configuration cache compatibility
    // Get the latest available change notes from the changelog file
    changeNotes = properties("pluginVersion").map { pluginVersion ->
      with(changelog) {
        renderItem(
          (getOrNull(pluginVersion) ?: getUnreleased())
            .withHeader(false)
            .withEmptySections(false),
          Changelog.OutputType.HTML,
        )
      }
    }
  }


  runIde {
    autoReloadPlugins.set(true) // 如果你不希望插件在IDE运行期间自动重新加载，则可以将此设置为false
  }

  // Configure UI tests plugin
  // Read more: https://github.com/JetBrains/intellij-ui-test-robot
  runIdeForUiTests {
    systemProperty("robot-server.port", "8082")
    systemProperty("ide.mac.message.dialogs.as.sheets", "false")
    systemProperty("jb.privacy.policy.text", "<!--999.999-->")
    systemProperty("jb.consents.confirmation.enabled", "false")
  }

  signPlugin {
    certificateChain = environment("CERTIFICATE_CHAIN")
    privateKey = environment("PRIVATE_KEY")
    password = environment("PRIVATE_KEY_PASSWORD")
  }

//  publishPlugin {
//    dependsOn("patchChangelog")
//    token = environment("PUBLISH_TOKEN")
//    // The pluginVersion is based on the SemVer (https://semver.org) and supports pre-release labels, like 2.1.7-alpha.3
//    // Specify pre-release label to publish the plugin in a custom Release Channel automatically. Read more:
//    // https://plugins.jetbrains.com/docs/intellij/deployment.html#specifying-a-release-channel
//    channels = properties("pluginVersion").map {
//      listOf(
//        it.split('-').getOrElse(1) { "default" }.split('.').first()
//      )
//    }
//  }


  jar {
    from("dist") {
      into("resource")
    }
  }
//  jar {
//      exclude("dist/**")
//  }

}
