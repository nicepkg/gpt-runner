import { dirname, join } from 'path'
import fs from 'fs-extra'
import { execa } from 'execa'
import { PathUtils } from '@nicepkg/gpt-runner-shared/node'

const dir = PathUtils.getCurrentDirName(import.meta.url)
const root = dirname(dir)

async function buildVsix() {
  const pkgPath = join(root, 'package.json')
  const rawJSON = await fs.readFile(pkgPath, 'utf-8')
  const pkg = JSON.parse(rawJSON)
  pkg.name = 'gpt-runner'

  await fs.writeJSON(pkgPath, pkg, { spaces: 2 })
  await execa('pnpm', ['run', 'build'], { cwd: root, stdio: 'inherit' })

  try {
    console.log('\nBuild Vsix...\n')
    await execa('vsce', ['package', '-o', 'dist/gpt-runner.vsix', '--no-dependencies'], { cwd: root, stdio: 'inherit' })
  }
  finally {
    await fs.writeFile(pkgPath, rawJSON, 'utf-8')
  }
}

buildVsix()
