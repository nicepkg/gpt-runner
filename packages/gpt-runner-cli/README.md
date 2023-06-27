# GPT-Runner CLI 

GPT-Runner CLI (Command Line Interface) is a powerful tool that makes it easy for developers to manage AI presets and interact with their code files. It provides a simple way to increase team collaboration and improve development efficiency.

## Installation

To install GPT-Runner CLI, make sure you have Node.js (version 16.15.0 or higher) installed on your system. You can then install the CLI globally using the following command:

```sh
npm install -g gptr
```

## Usage

Once installed, you can go to your project path and run the `gptr` command to start the GPT-Runner server and open the web interface in your default browser.

```sh
cd <your-project-path>
gptr
```

### Command Overview

Here is an overview of the available commands and their descriptions:

- `gptr` (default): Starts the GPT-Runner server and opens the web interface in your default browser. You can also specify additional options to customize the behavior (see [command options](#command-options) below).

### Command Options

You can customize the behavior of the `gptr` command using the following options:

- `-p, --port [port number]`: Specify the server port (default: 3003).
- `-c, --config [file]`: Provide a path to your custom configuration file.
- `--share`: Share the GPT-Runner web interface temporarily using a Gradio link.
- `--no-open`: Do not open the web interface in your browser when the server starts.
- `--debug`: Enable debug mode for detailed logging.

## Examples

1. Start GPT-Runner with default settings:

   ```sh
   gptr
   ```

2. Start GPT-Runner on a specific port:

   ```sh
   gptr --port 4000
   ```

3. Start GPT-Runner with a custom configuration file:

   ```sh
   gptr --config ./scripts/gptr.config.json
   ```

4. Share the GPT-Runner web interface using a temporary Gradio link:

   ```sh
   gptr --share
   ```

5. Start GPT-Runner without opening the web interface in your browser:

   ```sh
   gptr --no-open
   ```

6. Start GPT-Runner in debug mode:

   ```sh
   gptr --debug
   ```

## Troubleshooting

If you encounter any issues or need more information on GPT-Runner CLI, refer to the [FAQ](https://github.com/nicepkg/gpt-runner/blob/main/website/faq-en.md) sections in the project documentation. If you can't find a solution there, feel free to open an [issue](https://github.com/nicepkg/gpt-runner/issues) on the project's GitHub page.

## Contributing

Contributions to GPT-Runner CLI are welcome! Check out the [contributing guideline](https://github.com/nicepkg/gpt-runner/blob/main/CONTRIBUTING.md) to get started.

## License

GPT-Runner CLI is provided under the [MIT License](./LICENSE).
