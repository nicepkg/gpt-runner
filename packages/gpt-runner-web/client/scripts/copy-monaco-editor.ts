import * as path from 'node:path'
import * as fs from 'fs-extra'

const resolvePath = (...paths: string[]) => path.resolve(__dirname, ...paths)
const sourceDir = resolvePath('../../node_modules/monaco-editor/min/vs')
const targetDir = resolvePath('../public', 'monaco-editor-vs')

// copy source directory to target directory
export async function copyMonacoEditor() {
  try {
    // if target directory exists, do nothing
    if (await fs.pathExists(targetDir))
      return

    await fs.ensureDir(targetDir)
    await fs.copy(sourceDir, targetDir)
    console.log('Copied \'monaco-editor/min/vs\' to \'public/monaco-editor-vs\'')
  }
  catch (err: any) {
    console.error(`Failed to copy 'monaco-editor/min/vs': ${err.message}`)
  }
}
