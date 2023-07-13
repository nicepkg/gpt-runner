<div align="center">
<img src="https://github.com/2214962083/2214962083/assets/34775414/a48b745f-c803-4884-95a8-26c63f7f5b53" alt="icon"/>

<h1 align="center">GPT-Runner CLI 🛠️</h1>

[English 🌏](https://github.com/nicepkg/gpt-runner/tree/main/packages/gpt-runner-cli/README.md) / 简体中文

[![npm](https://img.shields.io/npm/v/@nicepkg/gpt-runner-cli.svg)](https://www.npmjs.com/package/@nicepkg/gpt-runner-cli)
[![CLI](https://img.shields.io/badge/CLI-Node.js-green?logo=node.js)](https://github.com/nicepkg/gpt-runner/tree/main/packages/gpt-runner-cli/)
[![License](https://img.shields.io/github/license/nicepkg/gpt-runner)](https://github.com/nicepkg/gpt-runner/blob/main/LICENSE)
![GitHub stars](https://img.shields.io/github/stars/nicepkg/gpt-runner?style=social)

GPT-Runner CLI 是一款功能强大的命令行工具，可帮助您管理 AI 预设并与代码进行 AI 驱动的对话，从而显着提高您的开发效率 💪。

</div>

[![GPT-Runner Intro](https://raw.githubusercontent.com/2214962083/2214962083/main/gpt-runner-vscode-intro.gif)](https://user-images.githubusercontent.com/35005637/252378643-f0d053ac-88db-4b92-966a-75a411a1ce6c.mp4 "GPT-Runner Intro")

<details>
<summary> 📚 目录</summary><br>

- [⚙️ 特性](#️-特性)
- [📦 安装](#-安装)
- [🚀 快速开始](#-快速开始)
- [💡 CLI 命令](#-cli-命令)
- [📖 文档](#-文档)
  - [GPT-Runner 配置和 AI 预设文件](#gpt-runner-配置和-ai-预设文件)
  - [GPT-Runner Ui 用法](#gpt-runner-ui-用法)
- [❓ 常见问题](#-常见问题)
- [💖 赞助](#-赞助)
- [🤝 贡献者](#-贡献者)
- [📜 许可证](#-许可证)

<br></details>

## ⚙️ 特性

- **⚡ 启动 GPT-Runner 服务器:** 使用一个简单的命令快速启动 GPT-Runner 的本地开发服务器。
- **🔧 可自定义服务器端口:** 指定服务器端口。
- **🌍 自定义全局配置:** 指定 GPT-Runner 的全局配置文件路径。
- **🔄 可共享的服务器链接:** 通过临时链接分享正在运行的服务器。
- **🐞 支持调试:** 在调试模式下运行服务器，方便故障排查。

## 📦 安装

> 1. 要求 NodeJS >= 16.15.0
>    - 要检查您的 NodeJS 版本，在终端运行 `node -v` 。如果需要安装或更新 NodeJS ，请访问[官方 NodeJS 网站](https://nodejs.org/)以获取下载和安装指南。
> 2. 确保你有一个 Open AI Key 或 Anthropic Key，如果没有，请访问 [Open AI](https://platform.openai.com/account/api-keys) 或 [Anthropic](https://www.anthropic.com/product/) 申请。
> 3. 确保你的命令终端能 ping 通 google.com （如果你在中国大陆，你可能需要科学上网）。
> 4. 安装速度较慢是正常的，因为软件包体积较大。

使用 npm 安装 GPT-Runner CLI :

```bash
npm install -g gptr

# 检查版本
gptr --version

# 升级版本
# npm update -g gptr
```

此命令告诉 npm ( Node.js 包管理器) 全局安装 GPT-Runner CLI。其中，`-g` 选项表示全局安装，这意味着您可以在任何地方运行 GPT-Runner CLI。

## 🚀 快速开始

转到项目文件夹并输入以下命令:

```bash
gptr

# 等价于
# npx gptr
```

或者你可以运行特定的根路径

```bash
gptr ./src

# 等价于
# npx gptr ./src
```

当你运行 gptr 时，它将检索当前目录和整个项目有效文件中的全局配置文件 [gptr.config.json](https://github.com/nicepkg/gpt-runner/tree/main/docs/examples/gptr.config.json) 和 [*.gpt.md](https://github.com/nicepkg/gpt-runner/tree/main/docs/examples/example-cn.gpt.md) AI 预设文件，然后在浏览器中打开一个 Web AI 聊天窗口。

现在，你可以在浏览器的 [http://localhost:3003](http://localhost:3003) 上看到 GPT-Runner 的 Web 界面。

## 💡 CLI 命令

您可以使用以下选项与 GPT-Runner CLI 一起使用：

- `-p，--port [端口号]`：此选项允许您指定服务器监听的端口号。默认值为 `3003` 。如果您希望修改这个值，只需在您的命令后面添加此选项，然后跟上您想要的端口号。例如：`--port 8080` 。

- `-c，--config [文件路径]`：此选项允许您指定 GPT-Runner 的全局配置文件路径。如果您的配置文件不在默认位置，或者您有多个配置文件，您可以使用此选项告诉 GPT-Runner 使用哪个文件。例如，如果您在项目的根目录中有一个名为 [gptr.config.json](https://github.com/nicepkg/gpt-runner/tree/main/docs/examples/gptr.config.json) 的配置文件，您可以如下使用此选项：`--config ./gptr.config.json`。当然我们会默认检测 gptr 运行目录下的 [gptr.config.json](https://github.com/nicepkg/gpt-runner/tree/main/docs/examples/gptr.config.json)。

- `--share`：此标志通过一个临时链接分享正在运行的服务器。它不需要一个值，你可以简单地添加它来启用分享功能。例如：`gptr --share` 。首次分享时需要下载一些依赖，所以会比较慢。

- `--no-open`：默认情况下，当您启动服务器时，GPT-Runner CLI 会在您的默认网络浏览器中打开用户界面。如果您不希望这样做，使用此选项。例如：`gptr --no-open`。

- `--debug`：此标志以调试模式运行服务器。在调试模式下，CLI 将输出可以帮助进行故障排除的额外信息。要启用调试模式，只需在您的命令后面添加此标志。例如：`gptr --debug`。

这里有一个使用所有选项的例子：

```bash
gptr --port 8080 --config ./gptr.config.json --share --no-open --debug
```

在这个例子中，GPT-Runner CLI 将在端口 8080 上启动一个服务器，使用 [gptr.config.json](https://github.com/nicepkg/gpt-runner/tree/main/docs/examples/gptr.config.json) 的配置文件，分享服务器链接，不自动在浏览器中打开，并以调试模式运行。

## 📖 文档

### GPT-Runner 配置和 AI 预设文件

关于 `gptr.config.json` 配置文件、`xxx.gpt.md` AI 预设文件、`.gpt-runner` 特殊目录的详细介绍请参见这里：

[GPT-Runner 配置和 AI 预设文件](https://github.com/nicepkg/gpt-runner/blob/main/docs/gpt-config.cn.md)

### GPT-Runner Ui 用法

[GPT-Runner Ui使用介绍](https://github.com/nicepkg/gpt-runner/blob/main/docs/ui-usage.cn.md)

## ❓ 常见问题

[简体中文 > 常见问题](https://github.com/nicepkg/gpt-runner/tree/main/docs/faq.cn.md)

## 💖 赞助

等待你的赞助...

## 🤝 贡献者

你可以查看我们的[贡献指南](https://github.com/nicepkg/gpt-runner/tree/main/CONTRIBUTING.md)

这个项目得以存在，要感谢所有贡献者：

<a href="https://github.com/nicepkg/gpt-runner/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=nicepkg/gpt-runner" />
</a>

## 📜 许可证

[MIT](https://github.com/nicepkg/gpt-runner/tree/main/LICENSE) 许可证 &copy; 2023-PRESENT [Jinming Yang](https://github.com/2214962083)
