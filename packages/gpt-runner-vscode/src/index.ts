import type { ExtensionContext, StatusBarItem } from 'vscode'
import { StatusBarAlignment, commands, window, workspace } from 'vscode'
import { checkNodeVersion } from '@nicepkg/gpt-runner-shared/node'
import { version } from '../package.json'
import { log } from './log'
import { ContextLoader } from './contextLoader'
import { getExtConfiguration } from './utils'
import { Commands, EXT_DISPLAY_NAME } from './constant'
import { registerWebview } from './register/webview'
import { registerServer } from './register/server'
import { registerInsertCodes } from './register/insert-codes'
import { registerDiffCodes } from './register/diff-codes'
import { registerOpenInBrowser } from './register/open-in-browser'
import { registerStatusBar } from './register/status-bar'
import { registerCompletion } from './register/completion'

async function registerRoot(ext: ExtensionContext, status: StatusBarItem, cwd: string) {
  const contextLoader = new ContextLoader(cwd)

  await contextLoader.ready

  log.appendLine(`📁 Root context loaded: ${cwd}`)

  await registerServer(cwd, contextLoader, ext)
  await commands.executeCommand(Commands.RestartServer)

  await registerWebview(cwd, contextLoader, ext)
  await registerOpenInBrowser(cwd, contextLoader, ext)
  await registerStatusBar(cwd, contextLoader, ext)
  await registerInsertCodes(cwd, contextLoader, ext)
  await registerDiffCodes(cwd, contextLoader, ext)
  await registerCompletion(cwd, contextLoader, ext)

  return contextLoader
}

export async function activate(ext: ExtensionContext) {
  log.appendLine(`⚪️ ${EXT_DISPLAY_NAME} for VS Code v${version}\n`)

  const nodeValidMsg = checkNodeVersion()

  if (nodeValidMsg) {
    window.showErrorMessage(nodeValidMsg)
    return
  }

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
      commands.registerCommand(Commands.Reload, async () => {
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
