<div align="center">
<img src="https://github.com/2214962083/2214962083/assets/34775414/a48b745f-c803-4884-95a8-26c63f7f5b53" alt="icon"/>

<h1 align="center">GPT Runner</h1>

[English 🌏](https://github.com/nicepkg/gpt-runner/tree/main/README.md) / 简体中文

用 GPT-Runner 管理您的 AI 预设，通过 AI 与您的代码文件聊天，极大提升您和团队的开发效率！

[![CLI][cli-image]][cli-url]
[![Web][web-image]][web-url]
[![VSCode][vscode-image]][vscode-url]
[![License](https://img.shields.io/github/license/nicepkg/gpt-runner)][gpt-runner-license]
[![GitHub stars](https://img.shields.io/github/stars/nicepkg/gpt-runner?style=social)][gpt-runner-url]


[终端工具](https://github.com/nicepkg/gpt-runner/tree/main/packages/gpt-runner-cli/README_CN.md) / [网页版](https://github.com/nicepkg/gpt-runner/tree/main/packages/gpt-runner-web/) / [VSCode 扩展](https://github.com/nicepkg/gpt-runner/tree/main/packages/gpt-runner-vscode/README_CN.md) / [反馈](https://github.com/nicepkg/gpt-runner/issues) / [打赏开发者](https://user-images.githubusercontent.com/35005637/255805279-da299e44-ab7a-4038-b945-86d33128a775.jpg)

[cli-url]: https://github.com/nicepkg/gpt-runner/blob/main/packages/gpt-runner-cli/README_CN.md
[cli-image]: https://img.shields.io/badge/CLI-Node.js-green?logo=node.js
[gpt-runner-license]: https://github.com/nicepkg/gpt-runner/tree/main/LICENSE
[gpt-runner-url]: https://github.com/nicepkg/gpt-runner
[web-url]: https://github.com/nicepkg/gpt-runner/tree/main/packages/gpt-runner-web/README_CN.md
[web-image]: https://img.shields.io/badge/Web-React-blue?logo=react
[vscode-url]: https://github.com/nicepkg/gpt-runner/tree/main/packages/gpt-runner-vscode/README_CN.md
[vscode-image]: https://img.shields.io/badge/VSCode-Extension-blue?logo=visualstudiocode

</div>

https://user-images.githubusercontent.com/35005637/252378643-f0d053ac-88db-4b92-966a-75a411a1ce6c.mp4

<details>
<summary>📚 目录</summary><br>

- [🤷‍♂️ 为什么选择 GPT-Runner？](#️-为什么选择-gpt-runner)
- [⚙️ 主要功能](#️-主要功能)
- [🚀 快速开始](#-快速开始)
  - [方式一：CLI](#方式一cli)
  - [方式二：VSCode 扩展](#方式二vscode-扩展)
- [📖 文档](#-文档)
  - [GPT-Runner 配置和 AI 预设文件](#gpt-runner-配置和-ai-预设文件)
  - [GPT-Runner Ui 用法](#gpt-runner-ui-用法)
- [🗒️ 开发计划](#️-开发计划)
- [🆕 最新动态](#-最新动态)
- [❓ 常见问题](#-常见问题)
- [💖 赞助者](#-赞助者)
- [🤝 贡献者](#-贡献者)
- [🙏 鸣谢](#-鸣谢)
- [📜 许可证](#-许可证)

<br></details>

## 🤷‍♂️ 为什么选择 GPT-Runner？

1. **🔍 与代码文件对话：** 
    - 使用 GPT-Runner 前：必须手动复制多个文件代码到 ChatGPT 窗口，向 AI 提出需求或修复 bug 。🙁
    - 使用 GPT-Runner 后：只需在文件树中勾选项目文件，AI 将根据文件的最新内容为您提供解答！🤩

2. **📑 管理项目的AI预设：** 
    - 使用 GPT-Runner 前：保存在备忘录中的项目提示需要复制粘贴给 ChatGPT 才能提问，难以进行 git 版本管理。🤪
    - 使用 GPT-Runner 后：[xxx.gpt.md](https://github.com/nicepkg/gpt-runner/tree/main/docs/examples/example-cn.gpt.md) 文件代表一个AI角色预设，它易于阅读、修改并可进行版本控制。团队成员可以分享和优化 AI 预设，使其生成的代码更接近 100% 的可用性。🥰

## ⚙️ 主要功能

- **🔍 与代码文件对话：** 选择文件或文件夹与 AI 实时对话。
- **🛠️ 强大的 CLI 与 IDE 集成：** 在各种 IDE 中实现高效的 AI 工作流程。
- **🔖 管理你的 AI 预设：** 管理你的 AI 预设，它就像 AI 预设的本地 Storybook。
- **🤖 自定义 AI 参数：** 灵活控制 AI 模型的配置。
- **🔌 支持第三方 LLM：** 具有高度兼容性和适应性。
- **🔒 隐私优先：** 本地数据存储保护您的隐私。
- **🌎 国际化：** 支持多种语言。

## 🚀 快速开始

> 1. 确保你有一个 Open AI Key 或 Anthropic Key，如果没有，请访问 [Open AI](https://platform.openai.com/account/api-keys) 或 [Anthropic](https://www.anthropic.com/product/) 申请。
> 2. 确保你的命令终端能 ping 通 google.com （如果你在中国大陆，你可能需要科学上网）。

### 方式一：CLI


> 1. 要求 NodeJS >= 16.15.0
>    - 要检查您的 NodeJS 版本，请在终端中运行 `node -v`。如果您需要安装或更新 NodeJS，请访问 [官方 NodeJS 网站](https://nodejs.org/) 以获取下载和安装说明。
> 2. 首次执行以下命令会下载这个包，时间会比较长，这是正常的。

```bash
cd <你的项目路径>
npx gptr
```

在浏览器中打开 [http://localhost:3003](http://localhost:3003) 即可看到 GPT-Runner 的 Web 界面。

### 方式二：VSCode 扩展

> 要求 VSCode >= 1.78.0

从 VSCode Marketplace 安装 [GPT-Runner VSCode 扩展](https://marketplace.visualstudio.com/items?itemName=nicepkg.gpt-runner)。

## 📖 文档

### GPT-Runner 配置和 AI 预设文件

关于 `gptr.config.json` 配置文件、`xxx.gpt.md` AI 预设文件、`.gpt-runner` 特殊目录的详细介绍请参见这里：

[GPT-Runner 配置和 AI 预设文件](https://github.com/nicepkg/gpt-runner/blob/main/docs/gpt-config.cn.md)

### GPT-Runner Ui 用法

[GPT-Runner Ui使用介绍](https://github.com/nicepkg/gpt-runner/blob/main/docs/ui-usage.cn.md)

## 🗒️ 开发计划

- [ ] Jetbrains 插件：添加 Jetbrains IDE 插件
- [ ] 导出和导入聊天记录：添加对话导入导出功能
- [ ] AI预设商店：添加 AI 预设商店以供社区共享 AI 预设文件
- [ ] 模板插值：添加模板插值支持
- [ ] Electron：添加 Electron 客户端，将目标受众推广到非开发人员

## 🆕 最新动态

- 🚀 v1.0.0: 首次发布

## ❓ 常见问题

> 对 AI 提升开发效率感兴趣的，可以加我 wechat: qq2214962083 入群交流
> 
> 要求：会科学上网，使用过 chatgpt

[简体中文 > 常见问题](https://github.com/nicepkg/gpt-runner/tree/main/docs/faq.cn.md)

## 💖 赞助者

等待你的赞助...

## 🤝 贡献者

你可以查看我们的[贡献指南](https://github.com/nicepkg/gpt-runner/tree/main/CONTRIBUTING.md)

感谢所有为此项目做出贡献的人：

<a href="https://github.com/nicepkg/gpt-runner/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=nicepkg/gpt-runner" />
</a>

## 🙏 鸣谢

感谢以下项目的启示，使 GPT-Runner 成为可能：

> 字母顺序排列

- [Docusaurus](https://github.com/facebook/docusaurus)
- [Gradio](https://github.com/gradio-app/gradio)
- [LangchainJs](https://github.com/hwchase17/langchainjs)
- [Monaco-React](https://github.com/suren-atoyan/monaco-react)
- [UnoCss](https://github.com/unocss/unocss)
- [VSCode-Material-Icon-Theme](https://github.com/PKief/vscode-material-icon-theme)
- [VSCode-Webview-Ui-Toolkit](https://github.com/microsoft/vscode-webview-ui-toolkit)

## 📜 许可证

[MIT](https://github.com/nicepkg/gpt-runner/tree/main/LICENSE) License &copy; 2023-PRESENT [Jinming Yang](https://github.com/2214962083)
