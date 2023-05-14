import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// relative to scripts directory
const destinations = [
  ['../LICENSE', '../packages/gpt-runner-vscode/LICENSE'],
  ['../README.md', '../packages/gpt-runner-ui/README.md'],
]

const _filename = fileURLToPath(import.meta.url)
destinations.forEach(([src, dest]) => {
  copyFileSync(resolve(_filename, '..', src), resolve(_filename, '..', dest))
})
