# GPT-Runner

The GPT-Runner package is a powerful and versatile AI-driven tool designed to help developers improve their workflow by integrating AI-powered robot presets into their development environment. This package is a part of the larger GPT-Runner project and serves as the core engine behind its functioning.

## Overview

GPT-Runner enables developers to create and manage AI-powered robot presets through the use of `xxx.gpt.md` files within their projects. These files contain customizable parameters such as system prompts, user prompts, model names, and temperature, allowing developers to fine-tune the AI settings to suit their specific needs.

By integrating GPT-Runner into their development workflow, developers can enjoy features such as:

- AI Robot Preset-based Chats for efficient team communication and collaboration.
- Seamless integration with any IDE through the GPT-Runner CLI and IDE extensions.
- Customizable AI parameters for enhanced control and adaptability.

## Installation

To install and utilize the GPT-Runner package in your project, follow these steps:

1. Ensure that you have Node.js (version 16.15.0 or higher) installed on your system.
2. Add the GPT-Runner package as a dependency in your project by running the following command:

   ```sh
   npm install @nicepkg/gpt-runner
   ```

3. Import the GPT-Runner package in your project and utilize its features according to your requirements.

## Usage

Define your project configuration using the `defineConfig` function, providing it with a configuration object containing your project's preferences:

```javascript
import { defineConfig } from '@nicepkg/gpt-runner';

const config = defineConfig({
  rootPath: 'path/to/your/project/root',
  model: {
    type: 'openai',
    modelName: 'gpt-4',
    secrets: {
      apiKey: 'your_api_key'
    }
  }
});
```

### Other Functions and Utilities

GPT-Runner exposes various other functions and utilities from the shared `@nicepkg/gpt-runner-shared` package, which you can utilize in your project as required. Explore the GPT-Runner package source code and documentation for more information on the available functions and their use cases.

## Troubleshooting

If you encounter any issues or need more information on the GPT-Runner package, refer to the [FAQ](https://github.com/nicepkg/gpt-runner/blob/main/docs/faq-en.md) sections in the project documentation. If you can't find a solution there, feel free to open an [issue](https://github.com/nicepkg/gpt-runner/issues) on the project's GitHub page.

## Contributing

Contributions to the GPT-Runner package are welcome! Check out the [contributing guideline](https://github.com/nicepkg/gpt-runner/blob/main/CONTRIBUTING.md) to get started.

## License

The GPT-Runner package is provided under the [MIT License](https://github.com/nicepkg/gpt-runner/blob/main/LICENSE).
