<div align="center">
<img src="./docs/static/img/svg/logo-text.svg" alt="icon"/>

<h1 align="center">GPT Runner</h1>

English / [简体中文](./README_CN.md)

Manage ai presets. Chat with your code files. Revolutionize Your Team's Collaboration and Efficiency!

管理 ai 预设。 与您的代码文件聊天。 彻底改变您团队的协作和效率！

[![CLI][cli-image]][cli-url]
[![Web][web-image]][web-url]
[![VSCode][vscode-image]][vscode-url]

[CLI](https://github.com/nicepkg/gpt-runner/tree/main/packages/gpt-runner-cli/) / [Web App](https://github.com/nicepkg/gpt-runner/tree/main/packages/gpt-runner-web/) / [VSCode Extension](https://github.com/nicepkg/gpt-runner/tree/main/packages/gpt-runner-vscode/) / [Issues](https://github.com/nicepkg/gpt-runner/issues) / [Buy Me a Coffee](https://bmc.link/jinmingyang)

[终端工具](https://github.com/nicepkg/gpt-runner/tree/main/packages/gpt-runner-cli/) / [网页版](https://github.com/nicepkg/gpt-runner/tree/main/packages/gpt-runner-web/) / [VSCode 扩展](https://github.com/nicepkg/gpt-runner/tree/main/packages/gpt-runner-vscode/) / [反馈](https://github.com/Yidadaa/ChatGPT-Next-Web/issues) / [打赏开发者](https://github.com/nicepkg/gpt-runner/assets/35005637/98a4962a-8a2e-4177-8781-1e1ee886ecdc)

[cli-url]: ./packages/gpt-runner-cli/
[cli-image]: https://img.shields.io/badge/CLI-Node.js-green?logo=node.js
[web-url]: ./packages/gpt-runner-web/
[web-image]: https://img.shields.io/badge/Web-React-blue?logo=react
[vscode-url]: ./packages/gpt-runner-vscode/
[vscode-image]: https://img.shields.io/badge/VSCode-Extension-blue?logo=visualstudiocode

</div>

## Features

- **CLI & IDE Integration:** GPT-Runner offers a powerful command-line interface and IDE extension for AI robot presets through `xxx.gpt.md` files, enabling efficient AI workflows across various IDEs.
- **Chat with Your Files:** GPT-Runner allows you to chat with your code files. you can selected some files or folders, and then chat with them.
- AI Preset Chat: Developers can utilize `xxx.gpt.md` files for chat creation with Git version control, boosting team collaboration and communication.
- Custom AI Parameters: Harness the full potential of `xxx.gpt.md` files with customizable options like system/user prompts, model names, and temperature.
- LLM Compatibility: Built on LangchainJs, GPT-Runner supports OpenAI API key and access token methods, easily adapting to third-party LLMs.
- Privacy Focused: All data securely stored on your local PC.
- Web Sharing: Share GPT-Runner web interface via LAN IP or temporary Gradio link with the CLI Tunnel function.
- Theme Variety: GPT-Runner offers light/dark themes, auto-syncing with your VSCode theme and providing a responsive design.
- Web Internationalization: Supports English, 简体中文, 繁体中文, 日本語, and Deutsch.

## Documentation

Read the [documentation](https://gpt-runner.nicepkg.cn/) for more details.

## Roadmap

- [ ] Jetbrains Plugin: Add Jetbrains IDE Plugin
- [ ] Export Chat History: Add dialogue import and export function, compatible with OpenAI specification
- [ ] AI Preset Store: Add AI Preset Store for community sharing AI Preset File
- [ ] Template Interpolation: Add template interpolation support
- [ ] Electron: Add an Electron client to expand the target audience to non-developers

## What's New

- 🚀 v1.0.0: First Release

## 主要功能

- CLI与IDE集成：GPT-Runner 提供强大的命令行界面和IDE扩展，通过 `xxx.gpt.md` 文件实现AI机器人预设，支持各种IDE的高效AI工作流。
- 与文件聊天：GPT-Runner 允许您与代码文件聊天。您可以选择一些文件或文件夹，然后与它们聊天。
- 基于AI预设的聊天：开发人员可以利用xxx.gpt.md文件创建聊天并支持Git版本控制，提升团队协作和沟通。
- 自定义AI参数：充分发挥 `xxx.gpt.md` 文件的潜力，可自定义系统/用户提示、模型名称、温度等选项。
- LLM兼容性：基于 `LangchainJs` 构建，GPT-Runner 支持 OpenAI API Key 和 Access Token 方式，易于适应第三方LLM。
- 隐私优先：所有数据安全存储在本地PC上。
- 网络共享：通过局域网IP或CLI隧道功能的临时 Gradio 链接分享 GPT-Runner 网络界面。
- 主题多样性：GPT-Runner 提供亮/暗主题，与 VSCode 主题自动同步，并提供响应式设计。
- 网页国际化：支持 English, 简体中文, 繁体中文, 日本語 和 Deutsch。

## 文档

阅读 [文档](https://gpt-runner.nicepkg.cn/) 以获取更多详细信息。

## 开发计划

- [ ] Jetbrains 插件：添加 Jetbrains IDE 插件
- [ ] 导出聊天记录：添加对话导入导出功能，兼容OpenAI规范
- [ ] AI预设商店：添加AI预设商店以供社区共享AI预设文件
- [ ] 模板插值：添加模板插值支持
- [ ] Electron：添加 Electron 客户端，将目标受众推广到非开发人员

## 最新动态

- 🚀 v1.0.0: 首次发布

## FAQ

[English > FAQ](./docs/faq-en.md)

[简体中文 > 常见问题](./docs/faq-cn.md)

## Requirements

NodeJS >= 16.15.0

### Local Development

```shell
# install nodejs >= 16.15.0
npm i -g pnpm
pnpm i

# run server
cd packages/gpt-runner-web && pnpm dev:server

# open a new terminal and run client
cd packages/gpt-runner-web && pnpm dev:client
```

Now you can visit `http://localhost:3006` to see the result.

## Acknowledgement

GPT-Runner is made possible thanks to the inspirations from the following projects:

> in alphabet order

- [Docusaurus](https://github.com/facebook/docusaurus)
- [LangchainJs](https://github.com/hwchase17/langchainjs)
- [UnoCss](https://github.com/unocss/unocss)
- [VSCode-Webview-Ui-Toolkit](https://github.com/microsoft/vscode-webview-ui-toolkit)

### Sponsor

[Buy Me a Coffee](https://www.buymeacoffee.com/jinmingyang)

no...

### Contributor

[Contributors](https://github.com/nicepkg/gpt-runner/graphs/contributors)

## LICENSE

[MIT](./LICENSE) License &copy; 2023-PRESENT [Jinming Yang](https://github.com/2214962083)
