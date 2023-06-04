import type { ExtensionContext, StatusBarItem } from 'vscode'
import { StatusBarAlignment, commands, window, workspace } from 'vscode'
import { version } from '../package.json'
import { log } from './log'
import { ContextLoader } from './contextLoader'
import { getExtConfiguration } from './utils'
import { EXT_DISPLAY_NAME, EXT_NAME } from './constant'
import { registerWebview } from './register/webview'
import { registerServer } from './register/server'

async function registerRoot(ext: ExtensionContext, status: StatusBarItem, cwd: string) {
  const contextLoader = new ContextLoader(cwd)

  await contextLoader.ready

  log.appendLine(`📁 Root context loaded: ${cwd}`)

  registerServer(cwd, contextLoader, ext)
  registerWebview(cwd, contextLoader, ext)

  return contextLoader
}

export async function activate(ext: ExtensionContext) {
  log.appendLine(`⚪️ ${EXT_DISPLAY_NAME} for VS Code v${version}\n`)

  const projectPath = workspace.workspaceFolders?.[0].uri.fsPath
  if (!projectPath) {
    log.appendLine(`➖No active workspace found, ${EXT_DISPLAY_NAME} is disabled`)
    return
  }

  const { disabled } = getExtConfiguration()
  if (disabled) {
    log.appendLine('➖ Disabled by configuration')
    return
  }

  const status = window.createStatusBarItem(StatusBarAlignment.Right, 200)
  status.text = EXT_DISPLAY_NAME

  try {
    const contextLoader = registerRoot(ext, status, projectPath)

    ext.subscriptions.push(
      commands.registerCommand(`${EXT_NAME}.reload`, async () => {
        log.appendLine('🔁 Reloading...');
        (await contextLoader).reload()
        log.appendLine('✅ Reloaded.')
      }),
    )
  }
  catch (e: any) {
    log.appendLine(String(e.stack ?? e))
  }
}

export function deactivate() {}
