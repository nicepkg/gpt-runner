# GPT-Runner 配置和 AI 预设文件

<details>
<summary>目录</summary><br>

- [GPT-Runner 配置和 AI 预设文件](#gpt-runner-配置和-ai-预设文件)
  - [介绍](#介绍)
    - [.gpt-runner 目录](#gpt-runner-目录)
  - [gptr.config.ts/js/json 配置文件](#gptrconfigtsjsjson-配置文件)
  - [xxx.gpt.md AI 预设文件](#xxxgptmd-ai-预设文件)
  - [聊天模型配置](#聊天模型配置)
    - [OpenAI](#openai)
    - [Anthropic](#anthropic)
- [其他](#其他)

<br></details>

## 介绍

1. 当你启动 GPT-Runner 时，它会读先读取项目级配置文件。
   
2. 这不是必要的，但是当你想要覆盖一些全局配置，这很有用。
   
3. 按优先级排序，优先读取最前面的配置文件。

```yml
<rootPath>/.gpt-runner/gptr.config.ts
<rootPath>/.gpt-runner/gptr.config.js
<rootPath>/.gpt-runner/gptr.config.json

<rootPath>/gptr.config.ts
<rootPath>/gptr.config.js
<rootPath>/gptr.config.json
```

4. 接着 GPT-Runner 会深度检索当前文件夹下所有的 `*.gpt.md` 文件。
   
5. 这个过程默认是跳过项目的 `.gitignore` 里的文件的。这很省时间。
   
6. 你可以通过配置 `gptr.config.ts` 文件来改变检索范围。
   
7. 每个 `*.gpt.md` 文件都会被解析成一个 AI 预设。

### .gpt-runner 目录

1. `<rootPath>/.gpt-runner/` 目录是一个特殊目录，即便你把它包含在 `.gitignore` 里，它也会被检索。这对希望 GPT-Runner 不入侵项目的人很有用。

2. 你可以把 `gptr.config.json` 和 `*.gpt.md` 文件都放在这个目录里。

3. 然后再在 `.gitignore` 里添加 `.gpt-runner` 。既可以同时保证项目的干净，又可以让 GPT-Runner 读取到配置文件。

4. 如果你希望一劳永逸地 git ignore .gpt-runner 目录，你可以执行这句命令实现全局 git ignore:

```bash
git config --global core.excludesfile '~/.gitignore_global'

echo '.gpt-runner' >> ~/.gitignore_global
```

## gptr.config.ts/js/json 配置文件

1. gpt.config.ts/js/json 是一个配置文件，它可以覆盖项目级别全局配置。

2. 它的配置类型如下

```ts
export interface UserConfig {
  /**
   * 模型配置
   */
  model?: ModelConfig

  /**
   * 深度检索包含的文件路径，支持 glob
   * @default null
   */
  includes?: string | RegExp | string[] | RegExp[] | ((source: string) => boolean) | null

  /**
   * 深度检索排除的文件路径，支持 glob
   * @default [
        "** /node_modules",
        "** /.git",
        "** /__pycache__",
        "** /.Python",
        "** /.DS_Store",
        "** /.cache",
        "** /.next",
        "** /.nuxt",
        "** /.out",
        "** /dist",
        "** /.serverless",
        "** /.parcel-cache"
      ]
   */
  excludes?: string | RegExp | string[] | RegExp[] | ((source: string) => boolean) | null

  /**
   * 是否跳过 .gitignore 里的文件
   * 建议开启，这样可以节省检索时间
   * @default true
   */
  respectGitIgnore?: boolean
}

export interface ModelConfig {
  /**
   * 模型类型
   */
  type?: 'openai' | 'anthropic'

  /**
   * 模型名称
   */
  modelName?: string

  // ...更多配置请参考具体模型
}
```

3. 你可以在 `gptr.config.ts` 里使用 `defineConfig` 函数来配置 `UserConfig` 类型的配置文件。你可以安装 `@nicepkg/gpt-runner` 包。

```bash
npm i @nicepkg/gpt-runner
```

4. 你可以新建一个 `gptr.config.ts` 文件，然后在里填上示例配置：

```ts
import { defineConfig } from '@nicepkg/gpt-runner'

export default defineConfig({
  model: {
    type: 'openai',
    modelName: 'gpt-3.5-turbo-16k',
    temperature: 0.9,
  },
})
```

5. 当然你也可以装上我们的 VSCode 插件，它会自动根据我们的 [JSON Schema](https://unpkg.com/@nicepkg/gpt-runner-shared@latest/dist/json-schema/user-config.json) 来提示你的配置文件。

6. 这是一个极简的 `gptr.config.json` 的示例：

```json
{
  "model": {
    "type": "openai",
    "modelName": "gpt-3.5-turbo-16k"
  }
}
```

7. 这是一个完整的 `gptr.config.json` 的示例：
  
```json
{
  "model": {
    "type": "openai",
    "modelName": "gpt-3.5-turbo-16k",
    "temperature": 0.9,
    "maxTokens": 2000,
    "topP": 1,
    "frequencyPenalty": 0,
    "presencePenalty": 0
  },
  "includes": null,
  "excludes": [
    "**/node_modules",
    "**/.git",
    "**/__pycache__",
    "**/.Python",
    "**/.DS_Store",
    "**/.cache",
    "**/.next",
    "**/.nuxt",
    "**/.out",
    "**/dist",
    "**/.serverless",
    "**/.parcel-cache"
  ],
  "respectGitIgnore": true
}
```

## xxx.gpt.md AI 预设文件

1. `xxx.gpt.md` 文件是一个 AI 预设文件，一个文件代表一个 AI 角色。

2. 比如一个 `uni-test.gpt.md` 是专门为这个项目写单元测试的，一个 `doc.gpt.md` 是专门为这个项目写文档的。

3. 它具备非常大的价值，而且这对团队成员来说是可以复用的。

4. 为什么不是 `xxx.gpt.json` ？因为那样子的话， `System Prompt` 和 `User Prompt` 里的内容经常需要转义字符，这样子写起来很麻烦。

5. `xxx.gpt.md` 易于书写，易于阅读，易于维护。

6. 一个极简的 AI 预设文件如下：

````md
```json
{
  "title": "分类目录/AI角色名字"
}
```

# System Prompt

你是一个编码高手，你擅长重构代码，请遵循SOLID和KISS和DRY原则，然后重构这段代码使其变得更好

````
7. 一个完整的 AI 预设文件如下：

````md
```json
{
  "title": "分类目录/AI角色名字",
  "model": {
    "type": "openai",
    "modelName": "gpt-3.5-turbo-16k",
    "temperature": 0.9,
    "maxTokens": 2000,
    "topP": 1,
    "frequencyPenalty": 0,
    "presencePenalty": 0
  }
}
```

# System Prompt

你是一个编码高手，你擅长重构代码，请遵循SOLID和KISS和DRY原则，然后重构这段代码使其变得更好

# User Prompt

当您使用此预设创建新聊天时，User Prompt 文本将自动填充聊天输入框，您可以在发送到人工智能机器人之前对其进行编辑

# 备注

这里可以写你的备注

`model` / `modelName` / `temperature` / `System Prompt` / `User Prompt` 都是**可选**参数，而且可定制参数还有非常多。

你还可以通过项目根目录下的 `gptr.config.json` 覆盖很多参数的默认值
````

## 聊天模型配置

### OpenAI 

[官方请求参数文档](https://platform.openai.com/docs/api-reference/chat/create)

```ts
export interface OpenaiModelConfig {
  type: 'openai'

  /**
   * 模型名称
   */
  modelName: string

  /**
   * 温度
   */
  temperature?: number

  /**
   * 最大回复 token 数量
   */
  maxTokens?: number

  /**
   * 每个步骤考虑的 token 的总概率质量
   */
  topP?: number

  /**
   * 根据频率惩罚重复的 token
   */
  frequencyPenalty?: number

  /**
   * Penalizes repeated tokens
   */
  presencePenalty?: number
}
```

### Anthropic

[官方请求参数文档](https://docs.anthropic.com/claude/reference/complete_post)

```ts
export interface AnthropicModelConfig {
  type: 'anthropic'

  /**
   * 模型名称
   */
  modelName: string

  /**
   * 温度
   */
  temperature?: number

  /**
   * 最大回复 token 数量
   */
  maxTokens?: number

  /**
   * 每个步骤考虑的 token 的总概率质量
   */
  topP?: number

  /**
   * 仅从前 K 个选项中对每个后续选项进行采样
   */
  topK?: number
}
```

# 其他

1. 如果你安装了 GPT Runner VSCode 扩展。你可以通过在 `.vscode/settings.json` 设置：

```json
{
  "[markdown]": {
    "editor.quickSuggestions": {
      "other": true,
      "comments": false,
      "strings": true
    }
  }
}
```

以此在 `xxx.gpt.md` 文件开启提示和快捷代码片段，比如新建一个 `test.gpt.md` 文件，在里面输入 `gptr` 回车，你会快速得到一个精简的 AI 预设文件。

2. 后续我们还会适配更多 llm 模型
