# GPT-Runner Intellij

<!-- Plugin description -->
**GPT-Runner Intellij** is a 
<!-- Plugin description end -->

> **WIP**

## Getting started

> **Note**
> 
> Make sure to always upgrade to the latest version of `gradle-intellij-plugin`.

### Gradle properties

The project-specific configuration file [`gradle.properties`][file:gradle.properties] contains:

| Property name         | Description                                                                                               |
|-----------------------|-----------------------------------------------------------------------------------------------------------|
| `pluginGroup`         | Package name - after *using* the template, this will be set to `com.github.username.repo`.                |
| `pluginName`          | Plugin name displayed in the JetBrains Marketplace and the Plugins Repository.                            |
| `pluginRepositoryUrl` | Repository URL used for generating URLs by the [Gradle Changelog Plugin][gh:gradle-changelog-plugin]      |
| `pluginVersion`       | The current version of the plugin in [SemVer][semver] format.                                             |
| `pluginSinceBuild`    | The `since-build` attribute of the `<idea-version>` tag.                                                  |
| `pluginUntilBuild`    | The `until-build` attribute of the `<idea-version>` tag.                                                  |
| `platformType`        | The type of IDE distribution.                                                                             |
| `platformVersion`     | The version of the IntelliJ Platform IDE will be used to build the plugin.                                |
| `platformPlugins`     | Comma-separated list of dependencies to the bundled IDE plugins and plugins from the Plugin Repositories. |
| `gradleVersion`       | Version of Gradle used for plugin development.                                                            |

The properties listed define the plugin itself or configure the [gradle-intellij-plugin][gh:gradle-intellij-plugin] – check its documentation for more details.

In addition, extra behaviours are configured through the [`gradle.properties`][file:gradle.properties] file, such as:

| Property name                                    | Value   | Description                                                                                    |
|--------------------------------------------------|---------|------------------------------------------------------------------------------------------------|
| `kotlin.stdlib.default.dependency`               | `false` | Opt-out flag for bundling [Kotlin standard library][docs:kotlin-stdlib]                        |
| `org.gradle.configuration-cache`                 | `true`  | Enable [Gradle Configuration Cache][gradle:configuration-cache]                                |
| `org.gradle.caching`                             | `true`  | Enable [Gradle Build Cache][gradle:build-cache]                                                |
| `systemProp.org.gradle.unsafe.kotlin.assignment` | `true`  | Enable [Gradle Kotlin DSL Lazy Property Assignment][gradle:kotlin-dsl-assignment]              |
| `kotlin.incremental.useClasspathSnapshot`        | `false` | Temporary workaround for [Kotlin Compiler OutOfMemoryError][docs:intellij-platform-kotlin-oom] |

### Environment variables

Some values used for the Gradle configuration shouldn't be stored in files to avoid publishing them to the Version Control System.

To avoid that, environment variables are introduced, which can be provided within the *Run/Debug Configuration* within the IDE, or on the CI – like for GitHub: `⚙️ Settings > Secrets`.

Environment variables used by the current project are related to the [plugin signing](#plugin-signing) and [publishing](#publishing-the-plugin).

| Environment variable name | Description                                                                                                  |
|---------------------------|--------------------------------------------------------------------------------------------------------------|
| `PRIVATE_KEY`             | Certificate private key, should contain: `-----BEGIN RSA PRIVATE KEY----- ... -----END RSA PRIVATE KEY-----` |
| `PRIVATE_KEY_PASSWORD`    | Password used for encrypting the certificate file.                                                           |
| `CERTIFICATE_CHAIN`       | Certificate chain, should contain: `-----BEGIN CERTIFICATE----- ... -----END CERTIFICATE----`                |
| `PUBLISH_TOKEN`           | Publishing token generated in your JetBrains Marketplace profile dashboard.                                  |

## Plugin template structure

GPT-Runner Intellij repository contains the following content structure:

```
.
├── .github/                GitHub Actions workflows and Dependabot configuration files
├── .run/                   Predefined Run/Debug Configurations
├── build/                  Output build directory
├── gradle
│   ├── wrapper/            Gradle Wrapper
│   └── libs.versions.toml  Gradle version catalog
├── src                     Plugin sources
│   ├── main
│   │   ├── kotlin/         Kotlin production sources
│   │   └── resources/      Resources - plugin.xml, icons, messages
│   └── test
│       ├── kotlin/         Kotlin test sources
│       └── testData/       Test data used by tests
├── .gitignore              Git ignoring rules
├── build.gradle.kts        Gradle configuration
├── CHANGELOG.md            Full change history
├── gradle.properties       Gradle configuration properties
├── gradlew                 *nix Gradle Wrapper script
├── gradlew.bat             Windows Gradle Wrapper script
├── LICENSE                 License, MIT by default
├── qodana.yml              Qodana configuration file
├── README.md               README
└── settings.gradle.kts     Gradle project settings
```

In addition to the configuration files, the most crucial part is the `src` directory, which contains our implementation and the manifest for our plugin – [plugin.xml][file:plugin.xml].

Check our [IntelliJ Platform SDK DevGuide][docs], which contains an introduction to the essential areas of the plugin development together with dedicated tutorials.

## Testing

[Testing plugins][docs:testing-plugins] is an essential part of the plugin development to make sure that everything works as expected between IDE releases and plugin refactorings.
The IntelliJ Platform Plugin Template project provides integration of two testing approaches – functional and UI tests.

### Functional tests

Most of the IntelliJ Platform codebase tests are model-level, run in a headless environment using an actual IDE instance.
The tests usually test a feature as a whole rather than individual functions that comprise its implementation, like in unit tests.

> **Note**
> 
> Run your tests using predefined *Run Tests* configuration or by invoking the `./gradlew check` Gradle task.

### Code coverage

The [Kover][gh:kover] – a Gradle plugin for Kotlin code coverage agents: IntelliJ and JaCoCo – is integrated into the project to provide the code coverage feature.
Code coverage makes it possible to measure and track the degree of testing of the plugin sources.
The code coverage gets executed when running the `check` Gradle task.
The final test report is sent to [CodeCov][codecov] for better results visualization.

### UI tests

If your plugin provides complex user interfaces, you should consider covering them with tests and the functionality they utilize.

[IntelliJ UI Test Robot][gh:intellij-ui-test-robot] allows you to write and execute UI tests within the IntelliJ IDE running instance.
You can use the [XPath query language][xpath] to find components in the currently available IDE view.
Once IDE with `robot-server` has started, you can open the `http://localhost:8082` page that presents the currently available IDEA UI components hierarchy in HTML format and use a simple `XPath` generator, which can help test your plugin's interface.

> **Note**
> 
> Run IDE for UI tests using predefined *Run IDE for UI Tests* and then *Run Tests* configurations or by invoking the `./gradlew runIdeForUiTests` and `./gradlew check` Gradle tasks.

A dedicated [Run UI Tests](.github/workflows/run-ui-tests.yml.disabled) workflow is available for manual triggering to run UI tests against three different operating systems: macOS, Windows, and Linux.
Due to its optional nature, this workflow isn't set as an automatic one, but this can be easily achieved by changing the `on` trigger event, like in the [Build](.github/workflows/build.yml.disabled) workflow file.

## Qodana integration

To increase the project value, the IntelliJ Platform Plugin Template got integrated with [Qodana][jb:qodana], a code quality monitoring platform that allows you to check the condition of your implementation and find any possible problems that may require enhancing.

Qodana brings into your CI/CD pipelines all the smart features you love in the JetBrains IDEs and generates an HTML report with the actual inspection status.

Qodana inspection is configured with the `qodana { ... }` section in the Gradle build file and [`qodana.yml`][file:qodana.yml] YAML configuration file.

> **Note**
> 
> Qodana requires Docker to be installed and available in your environment.

To run inspections, you can use a predefined *Run Qodana* configuration, which will provide a full report on `http://localhost:8080`, or invoke the Gradle task directly with the `./gradlew runInspections` command.

A final report is available in the `./build/reports/inspections/` directory.

## Predefined Run/Debug configurations

Within the default project structure, there is a `.run` directory provided containing predefined *Run/Debug configurations* that expose corresponding Gradle tasks:

![Run/Debug configurations][file:run-debug-configurations.png]

| Configuration name   | Description                                                                                                                                                                   |
|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Run Plugin           | Runs [`:runIde`][gh:gradle-intellij-plugin-runIde] Gradle IntelliJ Plugin task. Use the *Debug* icon for plugin debugging.                                                    |
| Run Verifications    | Runs [`:runPluginVerifier`][gh:gradle-intellij-plugin-runPluginVerifier] Gradle IntelliJ Plugin task to check the plugin compatibility against the specified IntelliJ IDEs.   |
| Run Tests            | Runs [`:test`][gradle:lifecycle-tasks] Gradle task.                                                                                                                           |
| Run IDE for UI Tests | Runs [`:runIdeForUiTests`][gh:intellij-ui-test-robot] Gradle IntelliJ Plugin task to allow for running UI tests within the IntelliJ IDE running instance.                     |
| Run Qodana           | Runs [`:runInspections`][gh:gradle-qodana-plugin] Gradle Qodana Plugin task. Starts Qodana inspections in a Docker container and serves generated report on `localhost:8080`. |

### Changelog maintenance

The changelog is a curated list that contains information about any new features, fixes, and deprecations.
When they're provided, these lists are available in a few different places:
- the [CHANGELOG.md](./CHANGELOG.md) file,
- the [Releases page][gh:releases],
- the *What's new* section of JetBrains Marketplace Plugin page,
- and inside the Plugin Manager's item details.

There are many methods for handling the project's changelog.
The one used in the current template project is the [Keep a Changelog][keep-a-changelog] approach.

## Useful links

- [IntelliJ Platform SDK Plugin SDK][docs]
- [Gradle IntelliJ Plugin Documentation][gh:gradle-intellij-plugin-docs]
- [IntelliJ Platform Explorer][jb:ipe]
- [Marketplace Quality Guidelines][jb:quality-guidelines]
- [IntelliJ Platform UI Guidelines][jb:ui-guidelines]
- [Marketplace Paid Plugins][jb:paid-plugins]
- [Kotlin UI DSL][docs:kotlin-ui-dsl]
- [IntelliJ SDK Code Samples][gh:code-samples]
- [JetBrains Platform Slack][jb:slack]
- [JetBrains Platform Twitter][jb:twitter]
- [IntelliJ IDEA Open API and Plugin Development Forum][jb:forum]
- [Keep a Changelog][keep-a-changelog]
- [GitHub Actions][gh:actions]

[docs]: https://plugins.jetbrains.com/docs/intellij?from=IJPluginTemplate
[docs:intellij-platform-kotlin-oom]: https://plugins.jetbrains.com/docs/intellij/using-kotlin.html#incremental-compilation
[docs:kotlin-ui-dsl]: https://plugins.jetbrains.com/docs/intellij/kotlin-ui-dsl-version-2.html?from=IJPluginTemplate
[docs:kotlin]: https://plugins.jetbrains.com/docs/intellij/using-kotlin.html?from=IJPluginTemplate
[docs:kotlin-stdlib]: https://plugins.jetbrains.com/docs/intellij/using-kotlin.html?from=IJPluginTemplate#kotlin-standard-library
[docs:testing-plugins]: https://plugins.jetbrains.com/docs/intellij/testing-plugins.html?from=IJPluginTemplate

[file:gradle.properties]: ./gradle.properties
[file:plugin.xml]: ./src/main/resources/META-INF/plugin.xml
[file:run-debug-configurations.png]: .github/readme/run-debug-configurations.png
[file:qodana.yml]: ./qodana.yml

[gh:actions]: https://help.github.com/en/actions
[gh:code-samples]: https://github.com/JetBrains/intellij-sdk-code-samples
[gh:dependabot]: https://docs.github.com/en/free-pro-team@latest/github/administering-a-repository/keeping-your-dependencies-updated-automatically
[gh:gradle-changelog-plugin]: https://github.com/JetBrains/gradle-changelog-plugin
[gh:gradle-intellij-plugin]: https://github.com/JetBrains/gradle-intellij-plugin
[gh:gradle-intellij-plugin-docs]: https://plugins.jetbrains.com/docs/intellij/tools-gradle-intellij-plugin.html
[gh:gradle-intellij-plugin-runIde]: https://plugins.jetbrains.com/docs/intellij/tools-gradle-intellij-plugin.html#tasks-runide
[gh:gradle-intellij-plugin-runPluginVerifier]: https://plugins.jetbrains.com/docs/intellij/tools-gradle-intellij-plugin.html#tasks-runpluginverifier
[gh:gradle-qodana-plugin]: https://github.com/JetBrains/gradle-qodana-plugin
[gh:intellij-ui-test-robot]: https://github.com/JetBrains/intellij-ui-test-robot
[gh:kover]: https://github.com/Kotlin/kotlinx-kover
[gh:releases]: https://github.com/JetBrains/intellij-platform-plugin-template/releases

[gradle]: https://gradle.org
[gradle:build-cache]: https://docs.gradle.org/current/userguide/build_cache.html
[gradle:configuration-cache]: https://docs.gradle.org/current/userguide/configuration_cache.html
[gradle:kotlin-dsl]: https://docs.gradle.org/current/userguide/kotlin_dsl.html
[gradle:kotlin-dsl-assignment]: https://docs.gradle.org/current/userguide/kotlin_dsl.html#kotdsl:assignment
[gradle:lifecycle-tasks]: https://docs.gradle.org/current/userguide/java_plugin.html#lifecycle_tasks

[jb:forum]: https://intellij-support.jetbrains.com/hc/en-us/community/topics/200366979-IntelliJ-IDEA-Open-API-and-Plugin-Development
[jb:ipe]: https://jb.gg/ipe
[jb:paid-plugins]: https://plugins.jetbrains.com/docs/marketplace/paid-plugins-marketplace.html
[jb:qodana]: https://www.jetbrains.com/help/qodana
[jb:quality-guidelines]: https://plugins.jetbrains.com/docs/marketplace/quality-guidelines.html
[jb:slack]: https://plugins.jetbrains.com/slack
[jb:twitter]: https://twitter.com/JBPlatform
[jb:ui-guidelines]: https://jetbrains.github.io/ui

[codecov]: https://codecov.io
[keep-a-changelog]: https://keepachangelog.com
[keep-a-changelog-how]: https://keepachangelog.com/en/1.0.0/#how
[semver]: https://semver.org
[xpath]: https://www.w3.org/TR/xpath-21/


## 支持版本
不支持2021年以及以前版本
2022.1
2022.2


问题:

1. gradle task启动cd packages/gpt-runner-web && pnpm build
2.gradle build 将gpt-runner-web/dist给压缩到 dist.zip复制到resource.
3. 解压启动 node resource/dist/start-server.cjs

cd /Users/houzi/Library/Application\ Support/JetBrains/GoLand2022.2/plugins/GPT-Runner
houzi@MichaeldeMacBook-Pro-4 github-copilot-intellij % tree
.
├── NOTICE.txt
├── copilot-agent
│   ├── bin
│   │   ├── copilot-agent-linux
│   │   ├── copilot-agent-macos
│   │   ├── copilot-agent-macos-arm64
│   │   └── copilot-agent-win.exe
│   └── dist
│       ├── agent.js
│       ├── agent.js.LICENSE.txt
│       ├── tokenizer_cushman001.json
│       ├── tokenizer_cushman002.json
│       ├── tree-sitter-go.wasm
│       ├── tree-sitter-javascript.wasm
│       ├── tree-sitter-python.wasm
│       ├── tree-sitter-ruby.wasm
│       ├── tree-sitter-typescript.wasm
│       ├── tree-sitter.wasm
│       ├── vocab_cushman001.bpe
│       └── vocab_cushman002.bpe
├── intellij-community-LICENSE.txt
└── lib
├── annotations-3.0.1u2.jar
├── core-1.2.2.jar
├── github-copilot-intellij-1.2.2.2371.jar
├── jcip-annotations-1.0.jar
├── jsr305-3.0.1.jar
├── plugin-ideavim-1.2.2.jar
└── plugin-textmate-1.2.2.jar


houzi@MichaeldeMacBook-Pro-4 GPT-Runner % tree
.
└── lib
├── annotations-23.0.0.jar
├── instrumented-gpt-runner-intellij-0.0.1.jar
├── kotlin-stdlib-1.8.20.jar
├── kotlin-stdlib-common-1.8.20.jar
├── kotlin-stdlib-jdk7-1.8.20.jar
├── kotlin-stdlib-jdk8-1.8.20.jar
├── kotlinx-coroutines-core-jvm-1.7.2.jar
└── searchableOptions-0.0.1.jar
└── dist
...
1 directory, 8 files

思路
实际上要做的内容是：在开发环境下不解压这玩意
而是通过gradle task启动gpt-runner-web

还有一个要做的是gradle build的时候，把gpt-runner-web也给build了然后压缩成zip放到resource目录下


cn.nicepkg.gptrunner.intellij

val copyDist = tasks.register("copyDist", Copy::class) {
from("dist")
into("build/resources/main/dist")
}

tasks.getByName("processResources") {
dependsOn(copyDist)
}

//val startNodeServer by tasks.registering(Exec::class) {
////  commandLine("node", "dist/start-server.cjs")
//  // Set the working directory to the root of your project where "dist" and "dist/start-server.cjs" are located
//  workingDir(project.projectDir)
//}


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

//  init {
//    if (gptRunnerExecutableDir.notExists()) {
//      gptRunnerExecutableDir.createDirectories()
//      unzipGPTRunnerExecutable()
//    } else if (gptRunnerExecutableDir.listDirectoryEntries().isEmpty()) {
//      unzipGPTRunnerExecutable()
//    }
//  }

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


用户的node
pkg start-server.cjs --targets node16-macos-x64 --output server-executable

用户的node
pkg start-server.cjs --targets node16-macos-x64 --output server-executable

用户arm
--targets node16-macos-arm64
