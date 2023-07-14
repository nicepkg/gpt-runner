<div align="center">
<img src="https://github.com/nicepkg/vr360/assets/35005637/102953c3-e804-46db-b0b3-acc26a8d37da" alt="icon"/>

<h1 align="center">GPT-Runner CLI 🛠️</h1>

English / [简体中文 🌏](https://github.com/nicepkg/gpt-runner/tree/main/packages/gpt-runner-cli/README_CN.md)

[![npm](https://img.shields.io/npm/v/@nicepkg/gpt-runner-cli.svg)](https://www.npmjs.com/package/@nicepkg/gpt-runner-cli)
[![CLI](https://img.shields.io/badge/CLI-Node.js-green?logo=node.js)](https://github.com/nicepkg/gpt-runner/tree/main/packages/gpt-runner-cli/)
[![License](https://img.shields.io/github/license/nicepkg/gpt-runner)](https://github.com/nicepkg/gpt-runner/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/nicepkg/gpt-runner?style=social)](https://github.com/nicepkg/gpt-runner)

The GPT-Runner CLI is a powerful command-line tool that helps you manage your AI presets and engage in AI-powered conversations with your code to significantly boost your development efficiency. 💪

GPT-Runner CLI 是一款功能强大的命令行工具，可帮助您管理 AI 预设并与代码进行 AI 驱动的对话，从而显着提高您的开发效率。💪

</div>

[![GPT-Runner Intro](https://raw.githubusercontent.com/2214962083/2214962083/main/gpt-runner-vscode-intro.gif)](https://user-images.githubusercontent.com/35005637/252378643-f0d053ac-88db-4b92-966a-75a411a1ce6c.mp4 "GPT-Runner Intro")

<details>
<summary> 📚 Table of Contents</summary><br>

- [⚙️ Features](#️-features)
- [📦 Installation](#-installation)
- [🚀 Quick Start](#-quick-start)
- [💡 CLI Commands](#-cli-commands)
- [📖 Documentation](#-documentation)
  - [GPT-Runner Configs And AI Preset Files](#gpt-runner-configs-and-ai-preset-files)
  - [GPT-Runner Ui Usage](#gpt-runner-ui-usage)
- [❓ FAQ](#-faq)
- [💖 Sponsor](#-sponsor)
- [🤝 Contributor](#-contributor)
- [📜 License](#-license)

<br></details>

## ⚙️ Features

- **⚡ Start GPT-Runner Server:** Quickly start a local development server for GPT-Runner with a simple command.
- **🔧 Customizable Server Port:** Specify the server port
- **🌍 Customizable Global Configuration:** Specify the path to the global configuration file of GPT-Runner.
- **🔄 Shareable Server Link:** Share the running server through a temporal link.
- **🐞 Debugging Support:** Run the server in debug mode to facilitate troubleshooting.

## 📦 Installation


> 1. Requirements NodeJS >= 16.15.0
>     - To check your NodeJS version, run `node -v` in your terminal. If you need to install or update NodeJS, visit [the official NodeJS website](https://nodejs.org/) for download and installation instructions.
> 2. Make sure you have an Open AI Key or a Anthropic Key. You can get it from [Open AI](https://platform.openai.com/account/api-keys) or [Anthropic](https://www.anthropic.com/).
> 3. Slow installation is normal, because the package is a bit big.

To install the GPT-Runner CLI, use npm:

```bash
npm install -g gptr

# check version
gptr --version

# upgrade version
# npm update -g gptr
```

This command tells npm (Node.js package manager) to install GPT-Runner CLI globally. Among them, the `-g` option means global installation, which means you can run GPT-Runner CLI anywhere.

## 🚀 Quick Start

Go to your project folder and type the following command:

```bash
gptr

# it's equivalent to
# npx gptr
```

Or you can run specific root path

```bash
gptr ./src

# it's equivalent to
# npx gptr ./src
```

When you run gptr, it will retrieve the global config file [gptr.config.json](https://github.com/nicepkg/gpt-runner/tree/main/docs/examples/gptr.config.json) and [*.gpt.md](https://github.com/nicepkg/gpt-runner/tree/main/docs/examples/example-en.gpt.md) AI preset files in your current directory and the entire project valid files, and then open a web AI chat window in the browser.

You can now see the GPT-Runner's web in your browser at [http://localhost:3003](http://localhost:3003).

## 💡 CLI Commands

You can utilize the following options with GPT-Runner CLI:

- `-p, --port [port number]`: This option allows you to specify the port number for the server to listen on. By default, the value is `3003`. If you wish to modify this, simply append this option followed by the desired port number to your command. For example: `--port 8080`.

- `-c, --config [filepath]`: This option allows you to specify the global configuration file path for GPT-Runner. If your configuration file is not in the default location, or if you have multiple configuration files, you can use this option to tell GPT-Runner which file to use. For example, if you have a configuration called [gptr.config.json](https://github.com/nicepkg/gpt-runner/tree/main/docs/examples/gptr.config.json) in the root of your project file, you can use this option as follows: `--config ./gptr.config.json`. Of course, we will detect [gptr.config.json](https://github.com/nicepkg/gpt-runner/tree/main/docs/examples/gptr.config.json) in the gptr running directory by default.

- `--share`: This flag shares the link to the running server through a temporal link. It doesn't require a value, you can simple add it to enable the sharing feature. For example: `gptr --share`. Some dependencies need to be downloaded when sharing for the first time, so it will be slower.

- `--no-open`: By default, the GPT-Runner CLI opens the user interface in your default web browser when you start the server. If you do not want this to happen, use this option. For example: `gptr --no-open`.

- `--debug`: This flag runs the server in debug mode. In the debug mode, the CLI will output additional information that can be helpful for troubleshooting. To enable the debug mode, simple append this flag to your command. For example: `gptr --debug`.

Here is an example of using all options:

```bash
gptr --port 8080 --config ./gptr.config.json --share --no-open --debug
```

In this example, the GPT-Runner CLI will start a server available at port 8080, use the [gptr.config.json](https://github.com/nicepkg/gpt-runner/tree/main/docs/examples/gptr.config.json) configuration file, share the server link, not automatically open in the browser, and run in debug mode.


## 📖 Documentation

### GPT-Runner Configs And AI Preset Files

For details about `gptr.config.json` configuration file, `xxx.gpt.md` AI preset file, `.gpt-runner` special directory, please refer to here:

[Introduction to GPT-Runner Configs And AI Preset Files](https://github.com/nicepkg/gpt-runner/blob/main/docs/gpt-config.en.md)

### GPT-Runner Ui Usage

[Introduction to GPT-Runner Ui Usage](https://github.com/nicepkg/gpt-runner/blob/main/docs/ui-usage.en.md)

  
## ❓ FAQ

> You can contact me via [2214962083@qq.com](mailto:2214962083@qq.com)
> 
> 对 AI 提升开发效率感兴趣的，可以加我 wechat: qq2214962083 入群交流
> 
> 要求：会科学上网，使用过 chatgpt

[English > FAQ](https://github.com/nicepkg/gpt-runner/tree/main/docs/faq.en.md)

## 💖 Sponsor

Waiting for you...

## 🤝 Contributor

You can check out our [Contribution Guidelines](https://github.com/nicepkg/gpt-runner/tree/main/CONTRIBUTING.md)

This project exists thanks to all the people who contribute:

<a href="https://github.com/nicepkg/gpt-runner/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=nicepkg/gpt-runner" />
</a>

## 📜 License

[MIT](https://github.com/nicepkg/gpt-runner/tree/main/LICENSE) License &copy; 2023-PRESENT [Jinming Yang](https://github.com/2214962083)
