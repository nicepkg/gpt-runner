import { resolve } from 'node:path'

function r(p: string) {
  return resolve(__dirname, p)
}

export const alias: Record<string, string> = {
  '@nicepkg/gpt-runner': r('./packages/gpt-runner/src/'),
  '@nicepkg/gpt-runner-cli': r('./packages/gpt-runner-cli/src/'),
  '@nicepkg/gpt-runner-config': r('./packages/gpt-runner-config/src/'),
  '@nicepkg/gpt-runner-web/client': r('./packages/gpt-runner-web/client/src/'),
  '@nicepkg/gpt-runner-web/server': r('./packages/gpt-runner-web/server/src/'),
  '@nicepkg/gpt-runner-shared/browser': r('./packages/gpt-runner-shared/src/browser'),
  '@nicepkg/gpt-runner-shared/common': r('./packages/gpt-runner-shared/src/common'),
  '@nicepkg/gpt-runner-shared/node': r('./packages/gpt-runner-shared/src/node'),
}
