# GPT-Runner Configs And AI Preset Files

<details>
<summary>Table of Contents</summary><br>

- [GPT-Runner Configs And AI Preset Files](#gpt-runner-configs-and-ai-preset-files)
  - [Introduction](#introduction)
    - [.gpt-runner Directory](#gpt-runner-directory)
  - [gptr.config.ts/js/json Configuration Files](#gptrconfigtsjsjson-configuration-files)
  - [xxx.gpt.md AI Preset Files](#xxxgptmd-ai-preset-files)
  - [Chat Model Configuration](#chat-model-configuration)
    - [OpenAI](#openai)
    - [Anthropic](#anthropic)
- [Other](#other)

<br></details>

## Introduction

1. When you start GPT-Runner, it first reads the project-level configuration file.

2. This isn't necessary, but it's useful when you want to override some global configurations.

3. Sorted by priority, it prefers to read the file at topmost.

```yml
<rootPath>/.gpt-runner/gptr.config.ts
<rootPath>/.gpt-runner/gptr.config.js
<rootPath>/.gpt-runner/gptr.config.json

<rootPath>/gptr.config.ts
<rootPath>/gptr.config.js
<rootPath>/gptr.config.json
```

4. Then GPT-Runner will deeply retrieve all `*.gpt.md` files under the current folder.

5. This process defaults to skipping the files in the project's `.gitignore` which saves time.

6. You can change the retrieval range by configuring the `gptr.config.ts` file.

7. Each `*.gpt.md` file is parsed into an AI preset.

### .gpt-runner Directory

1. `<rootPath>/.gpt-runner/` directory is a special directory. Even if you include it in `.gitignore`, it will be retrieved. This is useful for people who hope GPT-Runner doesn't intrude into the project.

2. You can put both `gptr.config.json` and `*.gpt.md` files in this directory.

3. Then add `.gpt-runner` in `.gitignore`. So you can keep the project clean and let GPT-Runner read the configuration files at the same time.

4. If you want to git ignore the `.gpt-runner` directory once and for all, you can execute this command to achieve global git ignore:

```bash
git config --global core.excludesfile '~/.gitignore_global'

echo '.gpt-runner' >> ~/.gitignore_global
```

## gptr.config.ts/js/json Configuration Files

1. gpt.config.ts/js/json is a configuration file, it can override project-level global configurations.

2. Its configuration type is as follows

```ts
export interface UserConfig {
  /**
   * Model configuration
   */
  model?: ModelConfig

  /**
   * Deep retrieval includes file paths, support glob
   * @default null
   */
  includes?: string | RegExp | string[] | RegExp[] | ((source: string) => boolean) | null

  /**
   * Deep retrieval excludes file paths, support glob
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
   * Skip the files in .gitignore
   * Recommended to turn on, this can save retrieval time
   * @default true
   */
  respectGitIgnore?: boolean
}

export interface ModelConfig {
  /**
   * Model type
   */
  type?: 'openai' | 'anthropic'

  /**
   * Model name
   */
  modelName?: string

  // ...more configurations please refer to specific model
}
```

3. You can use `defineConfig` function in `gptr.config.ts` to configure `UserConfig` type configuration file. You can install `@nicepkg/gpt-runner` package.

```bash
npm i @nicepkg/gpt-runner
```

4. You can create a new `gptr.config.ts` file, then fill in the sample configuration:

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

5. Of course, you can also install our VSCode plugin, it will automatically prompt your configuration file based on our [JSON Schema](https://unpkg.com/@nicepkg/gpt-runner-shared@latest/dist/json-schema/user-config.json).

6. This is the simple example for `gptr.config.json`:

```json
{
  "model": {
    "type": "openai",
    "modelName": "gpt-3.5-turbo-16k"
  }
}
```

7. This is the complete example for `gptr.config.json`:
  
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

## xxx.gpt.md AI Preset Files

1. `xxx.gpt.md` files are AI preset files, each file represents an AI character.

2. For example, a `uni-test.gpt.md` is specifically for this project to write unit tests, and a `doc.gpt.md` is specifically for this project to write documentation. 

3. It has great value and can be reused by team members.

4. Why not `xxx.gpt.json`? Because in that case, the content within `System Prompt` and `User Prompt` often need to escape characters, which makes it very troublesome to write.

5. It's easy to write, read, and maintain `xxx.gpt.md`.

6. A minimalist AI preset file looks like this:

````md
```json
{
  "title": "Category/AI character name"
}
```

# System Prompt

You're a coding master specializing in refactoring code. Please follow SOLID, KISS and DRY principles, and refactor this section of code to make it better.

```````

7. A complete AI preset file looks like this:

````md
```json
{
  "title": "Category/AI Character Name",
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

You are a coding master, skilled at refactoring code. Please adhere to the SOLID, KISS and DRY principles, and refactor this code to make it better.

# User Prompt

When you use this preset to create a new chat, the User Prompt text will automatically fill in the chat input box. You can edit it before sending it to the AI robot.

# Remark

You can write your remarks here. 

`model` / `modelName` / `temperature` / `System Prompt` / `User Prompt` are all **optional** parameters, and there are many more to customize.

You can also override many default parameter values through the `gptr.config.json` at the root directory of the project.
````

## Chat Model Configuration

### OpenAI 

[Official Request Parameters Documentation](https://platform.openai.com/docs/api-reference/chat/create)

```ts
export interface OpenaiModelConfig {
  type: 'openai'

  /**
   * Model name
   */
  modelName: string

  /**
   * Temperature
   */
  temperature?: number

  /**
   * Max reply token number
   */
  maxTokens?: number

  /**
   * Total probability mass of tokens per step
   */
  topP?: number

  /**
   * Penalize repeated tokens according to frequency
   */
  frequencyPenalty?: number

  /**
   * Penalizes repeated tokens
   */
  presencePenalty?: number
}
```

### Anthropic

[Official Request Parameters Documentation](https://docs.anthropic.com/claude/reference/complete_post)

```ts
export interface AnthropicModelConfig {
  type: 'anthropic'

  /**
   * Model name
   */
  modelName: string

  /**
   * Temperature
   */
  temperature?: number

  /**
   * Max reply token number
   */
  maxTokens?: number

  /**
   * Total probability mass of tokens per step
   */
  topP?: number

  /**
   * Only sample subsequent choices from the top K options
   */
  topK?: number
}
```


# Other

1. If you have installed GPT Runner VSCode extension. You can set in `.vscode/settings.json`:

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

Thus, in `xxx.gpt.md` file, you can open suggestions and fast code snippets, for instance, create a new `test.gpt.md` file, type in `gptr` then hit Enter, you will quickly get a simple AI preset file.

2. In the future, we will support more llm models
