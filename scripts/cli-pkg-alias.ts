import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(dirname, '..')
const gptRunnerCliPkgPath = path.join(root, './packages/gpt-runner-cli')
const gptrPkgPath = path.join(root, './packages/gptr')

async function cloneToGptrAliasPkg() {
  const pkgJsonPath = path.join(gptRunnerCliPkgPath, 'package.json')
  const gptrPkgJsonPath = path.join(gptrPkgPath, 'package.json')
  const rawJSON = await fs.readFile(pkgJsonPath, 'utf-8')
  const pkg = JSON.parse(rawJSON)
  pkg.name = 'gptr'

  await fs.ensureDir(gptrPkgPath)
  await fs.copy(gptRunnerCliPkgPath, gptrPkgPath)

  await fs.writeJSON(gptrPkgJsonPath, pkg, { spaces: 2 })
}

cloneToGptrAliasPkg()
