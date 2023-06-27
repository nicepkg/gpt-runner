<div align="center">
<img src="./website/static/img/svg/logo-text.svg" alt="icon"/>

<h1 align="center">GPT Runner</h1>

English / [简体中文](https://github.com/nicepkg/gpt-runner/tree/main/README_CN.md)

Manage ai presets. Chat with your code files. Revolutionize Your Team's Collaboration and Efficiency!

管理 ai 预设。 与您的代码文件聊天。 彻底改变您团队的协作和效率！

[![CLI][cli-image]][cli-url]
[![Web][web-image]][web-url]
[![VSCode][vscode-image]][vscode-url]

[CLI](https://github.com/nicepkg/gpt-runner/tree/main/packages/gpt-runner-cli/) / [Web Page](https://github.com/nicepkg/gpt-runner/tree/main/packages/gpt-runner-web/) / [VSCode Extension](https://github.com/nicepkg/gpt-runner/tree/main/packages/gpt-runner-vscode/) / [Issues](https://github.com/nicepkg/gpt-runner/issues) / [Buy Me a Coffee](https://bmc.link/jinmingyang)

[终端工具](https://github.com/nicepkg/gpt-runner/tree/main/packages/gpt-runner-cli/) / [网页版](https://github.com/nicepkg/gpt-runner/tree/main/packages/gpt-runner-web/) / [VSCode 扩展](https://github.com/nicepkg/gpt-runner/tree/main/packages/gpt-runner-vscode/) / [反馈](https://github.com/Yidadaa/ChatGPT-Next-Web/issues) / [打赏开发者](https://github.com/nicepkg/gpt-runner/assets/35005637/98a4962a-8a2e-4177-8781-1e1ee886ecdc)

[cli-url]: https://github.com/nicepkg/gpt-runner/tree/main/packages/gpt-runner-cli/
[cli-image]: https://img.shields.io/badge/CLI-Node.js-green?logo=node.js
[web-url]: https://github.com/nicepkg/gpt-runner/tree/main/packages/gpt-runner-web/
[web-image]: https://img.shields.io/badge/Web-React-blue?logo=react
[vscode-url]: https://github.com/nicepkg/gpt-runner/tree/main/packages/gpt-runner-vscode/
[vscode-image]: https://img.shields.io/badge/VSCode-Extension-blue?logo=visualstudiocode

</div>

<details>
<summary>Table of Contents</summary><br>

- [Why GPT-Runner?](#why-gpt-runner)
- [Features](#features)
- [Quick Start](#quick-start)
  - [The first way: CLI](#the-first-way-cli)
  - [The second way:  VSCode Extension](#the-second-way--vscode-extension)
- [Documentation](#documentation)
- [Road map](#road-map)
- [What's New](#whats-new)
- [为什么选择 GPT-Runner？](#为什么选择-gpt-runner)
- [主要功能](#主要功能)
- [快速开始](#快速开始)
  - [方式一：CLI](#方式一cli)
  - [方式二：VSCode 插件](#方式二vscode-插件)
- [文档](#文档)
- [开发计划](#开发计划)
- [最新动态](#最新动态)
- [FAQ](#faq)
- [Acknowledgement](#acknowledgement)
  - [Sponsor](#sponsor)
  - [Contributor](#contributor)
- [LICENSE](#license)

<br></details>

## Why GPT-Runner?

- With GPT-Runner, you can easily integrate AI-driven workflows into your team. 

- By harnessing the capabilities provided by GPT-Runner, you can achieve interactive conversations with your code, customize AI parameters to optimize results, and share preset files and configurations among your team members. 

- This will greatly enhance your team's collaboration capabilities and development efficiency.


## Features

- **Chat with code files:** Select files or folders to have real-time conversations with AI.
- **Powerful CLI and IDE integration:** Implement efficient AI workflows in various IDEs.
- **AI Preset Chat:** Manage your AI presets, a local Storybook for AI presets.
- **Customize AI parameters:** Flexibly control the configuration of AI models.
- **Support for third-party LLMs:** High compatibility and adaptability.
- **Privacy-first:** Local data storage protects your privacy.
- **Locale support:** Support for multiple languages.

## Quick Start

> Requirements NodeJS >= 16.15.0
> 
> To check your NodeJS version, run `node -v` in your terminal. If you need to install or update NodeJS, visit [the official NodeJS website](https://nodejs.org/) for download and installation instructions.

### The first way: CLI

```bash
cd <your project folder>
npx gptr
```

### The second way:  VSCode Extension

Install the [GPT-Runner VSCode Extension](https://marketplace.visualstudio.com/items?itemName=nicepkg.gpt-runner) from the VSCode Marketplace.

## Documentation

Read the [documentation](https://gpt-runner.nicepkg.cn/) for installation instructions, usage guide, and more details on GPT-Runner's features.

## Road map

- [ ] Jetbrains Plugin: Add Jetbrains IDE Plugin
- [ ] Export And Import Chat History: Add dialogue import and export function
- [ ] AI Preset Store: Add AI Preset Store for community sharing AI Preset File
- [ ] Template Interpolation: Add template interpolation support
- [ ] Electron: Add an Electron client to expand the target audience to non-developers

## What's New

- 🚀 v1.0.0: First Release

## 为什么选择 GPT-Runner？

- 使用GPT-Runner，您可以轻松地将AI驱动的工作流程集成到您的团队中。

- 通过利用GPT-Runner提供的功能，您可以实现与代码的交互式对话、自定义AI参数以优化结果，以及在团队间共享预设文件和配置。

- 这将大大提高您的团队协作能力和开发效率。

## 主要功能

- **与代码文件聊天：** 选择文件或文件夹与 AI 实时对话。
- **强大的 CLI 与 IDE 集成：** 在各种 IDE 中实现高效的 AI 工作流程。
- **AI预设聊天：** 管理你的 AI 预设，它是 AI 预设的本地 Storybook。
- **自定义AI参数：** 灵活控制AI模型的配置。
- **支持第三方LLM：** 具有高度兼容性和适应性。
- **隐私优先：** 本地数据存储保护您的隐私。
- **国际化：** 支持多种语言。

## 快速开始

> 要求 NodeJS >= 16.15.0
>
> 要检查您的 NodeJS 版本，请在终端中运行 `node -v`。如果您需要安装或更新 NodeJS，请访问 [官方 NodeJS 网站](https://nodejs.org/) 以获取下载和安装说明。

### 方式一：CLI

```bash
cd <你的项目路径>
npx gptr
```

### 方式二：VSCode 插件

从 VSCode Marketplace 安装 [GPT-Runner VSCode 插件](https://marketplace.visualstudio.com/items?itemName=nicepkg.gpt-runner)。

## 文档

阅读 [文档](https://gpt-runner.nicepkg.cn/) 以获取安装说明、使用指南和有关 GPT-Runner 功能的更多详细信息。

## 开发计划

- [ ] Jetbrains 插件：添加 Jetbrains IDE 插件
- [ ] 导出和导入聊天记录：添加对话导入导出功能
- [ ] AI预设商店：添加 AI 预设商店以供社区共享 AI 预设文件
- [ ] 模板插值：添加模板插值支持
- [ ] Electron：添加 Electron 客户端，将目标受众推广到非开发人员

## 最新动态

- 🚀 v1.0.0: 首次发布

## FAQ

[English > FAQ](https://github.com/nicepkg/gpt-runner/tree/main/docs/faq-en.md)

[简体中文 > 常见问题](https://github.com/nicepkg/gpt-runner/tree/main/docs/faq-cn.md)

## Acknowledgement

GPT-Runner is made possible thanks to the inspirations from the following projects:

> in alphabet order

- [Docusaurus](https://github.com/facebook/docusaurus)
- [LangchainJs](https://github.com/hwchase17/langchainjs)
- [UnoCss](https://github.com/unocss/unocss)
- [VSCode-Webview-Ui-Toolkit](https://github.com/microsoft/vscode-webview-ui-toolkit)

### Sponsor

no...

### Contributor

This project exists thanks to all the people who contribute:

<a href="https://github.com/nicepkg/gpt-runner/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=nicepkg/gpt-runner" />
</a>

## LICENSE

[MIT](https://github.com/nicepkg/gpt-runner/tree/main/LICENSE) License &copy; 2023-PRESENT [Jinming Yang](https://github.com/2214962083)
