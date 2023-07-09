# Contribution Guide

Hey there! We are really excited that you are interested in contributing. Before submitting your contribution, please make sure to take a moment and read through the following guide:

## 👨‍💻 Repository Setup

1. Fork the repo (click the <kbd>Fork</kbd> button at the top right of
   [this page](https://github.com/nicepkg/gpt-runner))

2. Clone your fork locally

```sh
git clone https://github.com/<your_github_username>/gpt-runner.git
cd gpt-runner
```

3. Install Dependencies. This project depends on node v16.15.0+ and pnpm 8.x

If you don't have pnpm installed, you should execute:

We use [`pnpm`](https://pnpm.io/) for this projects.

To install pnpm, you can

```bash
npm i -g pnpm

# check node version
node -v

# check pnpm version
pnpm -v
```

## 💡 Commands

### `pnpm dev`

Start the development environment.

It will start the  [stub the passive watcher when using `unbuild`](https://antfu.me/posts/publish-esm-and-cjs#stubbing).

### `pnpm build`

Build the project for production. The result is usually under `dist/`.

### `pnpm lint`

We use [ESLint](https://eslint.org/) for **both linting and formatting**. It also lints for JSON, YAML and Markdown files if exists.

You can run `pnpm lint --fix` to let ESLint formats and lints the code.

Learn more about the [ESLint Setup](#eslint).

[**We don't use Prettier**](#no-prettier).

### `pnpm test`

~~Run the tests. We mostly using [Vitest](https://vitest.dev/) - a replacement of [Jest](https://jestjs.io/).~~

**Current We Don't Have Test**

## 📦 Packages

### `@nicepkg/gpt-runner`

Only for `gptr.config.ts` file `defineConfig` type tips

### `@nicepkg/gpt-runner-core`

This is the main package that contains the core logic of the project.

### `@nicepkg/gpt-runner-cli`

This is the CLI package that contains the CLI logic of the project.

### `@nicepkg/gpt-runner-shared`

This is the shared package that contains the shared logic of the project.

### `@nicepkg/gpt-runner-vscode`

This is the VSCode extension package that contains the VSCode extension logic of the project.

#### How To Dev VSCode Extension

1. Run `cd packages/gpt-runner-vscode`
2. Run `pnpm dev` (Before it, You need to run `pnpm build` in the root directory first)
3. Run `code .` to open the project in another window of VSCode
4. Press <kbd>F5</kbd> to start the extension in debug mode

#### How To Build VSIX

1. Run `cd packages/gpt-runner-vscode`
2. Run `pnpm build:vsix` (Before it, You need to run `pnpm build` in the root directory first)
3. You can find the `gpt-runner.vsix` file in the `packages/gpt-runner-vscode/dist` directory
4. Right click the `gpt-runner.vsix` file and select `Install Extension VSIX...` to install the extension

### `@nicepkg/gpt-runner-web`

This is the Web package that contains both the server side and client side logic of the project.

#### How To Dev Web

1. Run `cd packages/gpt-runner-web`
2. Run `pnpm dev:server` (Before it, You need to run `pnpm dev` in the root directory first)
3. Run `pnpm dev:client`
4. open `http://localhost:3006` in your browser

## 🙌 Sending Pull Request

### Discuss First

Before you start to work on a feature pull request, it's always better to open a feature request issue first to discuss with the maintainers whether the feature is desired and the design of those features. This would help save time for both the maintainers and the contributors and help features to be shipped faster.

For typo fixes, it's recommended to batch multiple typo fixes into one pull request to maintain a cleaner commit history.

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages, which allows the changelog to be auto-generated based on the commits. Please read the guide through if you aren't familiar with it already.

Only `fix:` and `feat:` will be presented in the changelog.

Note that `fix:` and `feat:` are for **actual code changes** (that might affect logic).
For typo or document changes, use `docs:` or `chore:` instead:

- ~~`fix: typo`~~ -> `docs: fix typo`

### Pull Request

If you don't know how to send a Pull Request, we recommend reading [the guide](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

When sending a pull request, make sure your PR's title also follows the [Commit Convention](#commit-conventions).

If your PR fixes or resolves an existing issue, please add the following line in your PR description (replace `123` with a real issue number):

```markdown
fix #123
```

This will let GitHub know the issues are linked, and automatically close them once the PR gets merged. Learn more at [the guide](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword).

It's ok to have multiple commits in a single PR, you don't need to rebase or force push for your changes as we will use `Squash and Merge` to squash the commits into one commit when merging.

## 🧑‍🔧 Maintenance

This section is for maintainers with write access, or if you want to maintain your own forks.

### Update Dependencies

Keeping dependencies up-to-date is one of the important aspects to keep projects alive and getting latest bug fixes on time. We recommend to update dependencies in weekly or bi-weekly intervals.

We use [`taze`](https://github.com/antfu/taze) to update the dependencies manually most of the time. As deps updating bots like [Dependabot](https://github.com/dependabot) or [Renovate](https://renovatebot.com/) could be a bit annoying when you have a lot projects.

With `taze`, you can run `pnpm taze major -Ir` to check and select the versions to update interactive. `-I` stands for `--interactive`, `-r` stands for `--recursive` for monorepo.

After bumpping, we install them, runing build and test to verify nothing breaks before pushing to main.

### Releasing

Before you do, make sure you have lastest git commit from upstream and all CI passes.

We do `pnpm release`. It will prompts a list for the target version you want to release. After select, it will bump your package.json and commit the changes with git tag, powered by [`bumpp`](https://github.com/antfu/bumpp).

#### Build on CI

They will be triggered by the `v` prefixed git tag added by `bumpp`. The action is usually defined under `.github/workflows/release.yml`

> When maintaining your own fork, you might need to see `NPM_TOKEN` secret to your repository for it to publish the packages.

Changelogs are always generated by GitHub Actions.

## 📖 References

### ESLint

We use [ESLint](https://eslint.org/) for both linting and formatting with [`@antfu/eslint-config`](https://github.com/antfu/eslint-config).

<table><tr><td width="500px" valign="top">

#### IDE Setup

We recommend using [VS Code](https://code.visualstudio.com/) along with the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

With the settings on the right, you can have auto fix and formatting when you save the code you are editing.

</td><td width="500px"><br>

VS Code's `settings.json`

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll": false,
    "source.fixAll.eslint": true
  }
}
```

</td></tr></table>

### No Prettier

Since ESLint is already configured to format the code, there is no need to duplicate the functionality with Prettier ([*Why don't use prettier*](https://antfu.me/posts/why-not-prettier)). To format the code, you can run `pnpm lint --fix` or referring the [ESLint section](#eslint) for IDE Setup.

If you have Prettier installed in your editor, we recommend you disable it when working on the project to avoid conflict.
