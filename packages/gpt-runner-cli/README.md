# GPT Runner CLI

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/nicepkg/gpt-runner/blob/main/packages/gpt-runner-cli/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/nicepkg/gpt-runner.svg)](https://github.com/nicepkg/gpt-runner/stargazers)

The GPT Runner CLI is a command-line interface tool that allows developers to run AI-powered chat prompts in their projects. It provides a web interface and IDE extension to retrieve and create chat prompts based on AI robot presets.

## Features

- Retrieve AI robot preset chat prompts from `.gpt.md` files in your project
- Create new chat prompts based on the existing presets
- Included in Git version management for collaboration within your team

## Installation

To install the GPT Runner CLI, you need to have [Node.js](https://nodejs.org) installed on your machine. Then, you can install it globally using [npm](https://www.npmjs.com/package/@nicepkg/gpt-runner-cli) or [yarn](https://yarnpkg.com/package/@nicepkg/gpt-runner-cli):

```shell
# Using npm
$ npm install -g @nicepkg/gpt-runner-cli

# Using yarn
$ yarn global add @nicepkg/gpt-runner-cli
```

## Usage

Once installed, you can use the `gptr` command to start the GPT Runner CLI:

```shell
$ gptr [...rootPaths] -p [port number] [--no-open] [--debug]
```

- `rootPaths` (optional): Specify the root path(s) where the `.gpt.md` files are located. Multiple paths can be provided.
- `port` (optional): Specify the server port number. Default: 3003.
- `--no-open` (optional): Do not open the web interface in the browser automatically.
- `--debug` (optional): Enable debug mode.

## Contributing

Contributions to the GPT Runner CLI are welcome! Feel free to open issues and submit pull requests on the [GitHub repository](https://github.com/nicepkg/gpt-runner).

When contributing, please make sure to follow the [code of conduct](https://github.com/nicepkg/gpt-runner/blob/main/CODE_OF_CONDUCT.md).

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/nicepkg/gpt-runner/blob/main/packages/gpt-runner-cli/LICENSE) file for details.
