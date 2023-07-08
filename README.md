<div align="center">
<img src="./website/static/img/svg/logo-text.svg" alt="icon"/>

<h1 align="center">GPT Runner</h1>

English / [简体中文](https://github.com/nicepkg/gpt-runner/tree/main/README_CN.md)

Use GPT-Runner to manage your AI presets, engage in AI-powered conversations with your code, and significantly boost the development efficiency of both you and your team!

用 GPT-Runner 管理您的 AI 预设，通过 AI 与您的代码文件聊天，极大提升您和团队的开发效率！

[![CLI][cli-image]][cli-url]
[![Web][web-image]][web-url]
[![VSCode][vscode-image]][vscode-url]
![License](https://img.shields.io/github/license/nicepkg/gpt-runner)
![GitHub stars](https://img.shields.io/github/stars/nicepkg/gpt-runner?style=social)


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
- [GPT-Runner File](#gpt-runner-file)
- [Road map](#road-map)
- [What's New](#whats-new)
- [FAQ](#faq)
- [Sponsor](#sponsor)
- [Contributor](#contributor)
- [Acknowledgement](#acknowledgement)
- [LICENSE](#license)

<br></details>

## Why GPT-Runner?

1. **Conversations with Code Files:** 
    - Before using GPT-Runner: Manual copy and paste of multiple file codes into the ChatGPT window were required to propose features or fix bugs to AI.
    - After using GPT-Runner: Simply select your project files from the file tree. The AI will provide responses based on the most recent contents of those files.

2. **Manage the Project's AI Presets:** 
    - Before using GPT-Runner: Project prompts saved in memos needed to be copied and pasted to ChatGPT for inquiries, making it difficult to put them under git version control.
    - After using GPT-Runner: Each [xxx.gpt.md](https://github.com/nicepkg/gpt-runner/tree/main/docs/example.gpt.md) file represents an AI role preset. They are easy to read, modify, and can be version-controlled. Team members can share and enhance AI presets, making the code they produce closer to 100% usability.


## Features

- **Conversations with Code Files**: Select files or folders and engage in real-time conversations with AI.
- **Powerful CLI and IDE integration:** Implement efficient AI workflows in various IDEs.
- **AI Preset Manager:** Manage your AI presets, Just like a locally Storybook for AI presets.
- **Customize AI parameters:** Flexibly control the configuration of AI models.
- **Support for third-party LLMs:** High compatibility and adaptability.
- **Privacy-first:** Local data storage protects your privacy.
- **Locale support:** Support for multiple languages.

## Quick Start

> Make sure you have an Open AI Key or a Anthropic Key. You can get it from [Open AI](https://platform.openai.com/) or [Anthropic](https://www.anthropic.com/).


### The first way: CLI

> 1. Requirements NodeJS >= 16.15.0
>     - To check your NodeJS version, run `node -v` in your terminal. If you need to install or update NodeJS, visit [the official NodeJS website](https://nodejs.org/) for download and installation instructions.
> 2. First run the following command to download this package, which will take a long time, which is normal.


```bash
cd <your project folder>
npx gptr
```

You can see the web interface in your browser at [http://localhost:3003](http://localhost:3003).

### The second way:  VSCode Extension

> Requirements VSCode >= 1.72.0

Install the [GPT-Runner VSCode Extension](https://marketplace.visualstudio.com/items?itemName=nicepkg.gpt-runner) from the VSCode Marketplace.

## GPT-Runner File

For a detailed introduction about `.gpt-runner` directory, `*.gpt.md` files, and `gptr.config.json` files, please see here:

[Introduction to GPT-Runner Files](https://github.com/nicepkg/gpt-runner/blob/main/docs/gpt-config-en.gpt.md)

## Road map

- [ ] Jetbrains Plugin: Add Jetbrains IDE Plugin
- [ ] Export And Import Chat History: Add dialogue import and export function
- [ ] AI Preset Store: Add AI Preset Store for community sharing AI Preset File
- [ ] Template Interpolation: Add template interpolation support
- [ ] Electron: Add an Electron client to expand the target audience to non-developers

## What's New

- 🚀 v1.0.0: First Release

## FAQ

[English > FAQ](https://github.com/nicepkg/gpt-runner/tree/main/docs/faq-en.md)

## Sponsor

Waiting for you...

## Contributor

You can check out our [Contribution Guidelines](https://github.com/nicepkg/gpt-runner/tree/main/CONTRIBUTING.md)

This project exists thanks to all the people who contribute:

<a href="https://github.com/nicepkg/gpt-runner/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=nicepkg/gpt-runner" />
</a>

## Acknowledgement

GPT-Runner is made possible thanks to the inspirations from the following projects:

> in alphabet order

- [Docusaurus](https://github.com/facebook/docusaurus)
- [LangchainJs](https://github.com/hwchase17/langchainjs)
- [UnoCss](https://github.com/unocss/unocss)
- [VSCode-Webview-Ui-Toolkit](https://github.com/microsoft/vscode-webview-ui-toolkit)

## LICENSE

[MIT](https://github.com/nicepkg/gpt-runner/tree/main/LICENSE) License &copy; 2023-PRESENT [Jinming Yang](https://github.com/2214962083)
