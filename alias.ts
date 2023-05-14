import { resolve } from 'node:path'

function r(p: string) {
  return resolve(__dirname, p)
}

export const alias: Record<string, string> = {
  '@nicepkg/gpt-runner': r('./packages/gpt-runner/src/'),
  '@nicepkg/gpt-runner-cli': r('./packages/gpt-runner-cli/src/'),
  '@nicepkg/gpt-runner-config': r('./packages/gpt-runner-config/src/'),
  '@nicepkg/gpt-runner-core/client': r('./packages/gpt-runner-core/client/src/'),
  '@nicepkg/gpt-runner-core/server': r('./packages/gpt-runner-core/server/src/'),
  '@nicepkg/gpt-runner-shared': r('./packages/gpt-runner-shared/src/'),
}
