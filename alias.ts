import { resolve } from 'node:path'

function r(p: string) {
  return resolve(__dirname, p)
}

export const alias: Record<string, string> = {
  '@nicepkg/gpt-runner': r('./packages/gpt-runner/src/'),
  '@nicepkg/gpt-runner-cli': r('./packages/gpt-runner-cli/src/'),
  '@nicepkg/gpt-runner-core': r('./packages/gpt-runner-core/src/'),
  '@nicepkg/gpt-runner-shared': r('./packages/gpt-runner-shared/src/'),
  '@nicepkg/gpt-runner-vscode': r('./packages/gpt-runner-vscode/src/'),
  '@nicepkg/gpt-runner-web/client': r('./packages/gpt-runner-web/client/src/'),
  '@nicepkg/gpt-runner-web/server': r('./packages/gpt-runner-web/server/src/'),
}
