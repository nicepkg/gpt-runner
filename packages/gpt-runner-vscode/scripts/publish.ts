import fs from 'fs-extra'
import { execa } from 'execa'
import { PathUtils } from '@nicepkg/gpt-runner-shared/node'

const dirname = PathUtils.getCurrentDirName(import.meta.url, () => __dirname)
const root = PathUtils.join(dirname, '..')

async function publish() {
  const pkgPath = PathUtils.join(root, 'package.json')
  const rawJSON = await fs.readFile(pkgPath, 'utf-8')
  const pkg = JSON.parse(rawJSON)
  pkg.name = 'gpt-runner'
  await fs.writeJSON(pkgPath, pkg, { spaces: 2 })

  await execa('npm', ['run', 'build'], { cwd: root, stdio: 'inherit' })

  try {
    console.log('\nPublish to VSCE...\n')
    await execa('npx', ['vsce', 'publish', '--no-dependencies', '-p', process.env.VSCE_TOKEN!], { cwd: root, stdio: 'inherit' })
    // console.log('\nPublish to OVSE...\n')
    // await execa('npx', ['ovsx', 'publish', '--no-dependencies', '-p', process.env.OVSX_TOKEN!], { cwd: root, stdio: 'inherit' })
  }
  finally {
    await fs.writeFile(pkgPath, rawJSON, 'utf-8')
  }
}

publish()
