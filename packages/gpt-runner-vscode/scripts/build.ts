import fs from 'fs-extra'
import { execa } from 'execa'
import { PathUtils } from '@nicepkg/gpt-runner-shared/node'

const dirname = PathUtils.getCurrentDirName(import.meta.url, () => __dirname)
const root = PathUtils.join(dirname, '..')
const dist = PathUtils.join(root, 'dist')

// is build vsix
const isBuildVsix = process.argv.includes('--vsix')

async function build() {
  // remove <root>/dist
  await fs.remove(dist)

  const pkgPath = PathUtils.join(root, 'package.json')
  const rawJSON = await fs.readFile(pkgPath, 'utf-8')
  const pkg = JSON.parse(rawJSON)
  pkg.name = 'gpt-runner'

  await fs.writeJSON(pkgPath, pkg, { spaces: 2 })
  await execa('tsup', { cwd: root, stdio: 'inherit' })

  try {
    // copy from <root>/node_modules/@nicepkg/gpt-runner-web/dist to <root>/dist/web
    const webDistPath = PathUtils.join(root, 'dist/web')
    await fs.copy(
      PathUtils.join(root, 'node_modules/@nicepkg/gpt-runner-web/dist'),
      webDistPath,
    )

    // copy from <root>/node_modules/@nicepkg/gpt-runner-shared/dist/json-schema to <root>/dist/json-schema
    const jsonSchemaDistPath = PathUtils.join(root, 'dist/json-schema')
    await fs.copy(
      PathUtils.join(root, 'node_modules/@nicepkg/gpt-runner-shared/dist/json-schema'),
      jsonSchemaDistPath,
    )

    if (!isBuildVsix)
      return

    console.log('\nBuild Vsix...\n')
    await execa('vsce', ['package', '-o', 'dist/gpt-runner.vsix', '--no-dependencies'], { cwd: root, stdio: 'inherit' })
  }
  finally {
    await fs.writeFile(pkgPath, rawJSON, 'utf-8')
  }
}

build()
