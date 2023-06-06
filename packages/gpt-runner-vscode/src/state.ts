import type * as vscode from 'vscode'

export interface State {
  serverPort: number | null
  statusBarItem: vscode.StatusBarItem | null
  sidebarWebviewView: vscode.WebviewView | null
  insertCodes: string
  diffCodes: string
}

export const state: State = {
  serverPort: null,
  statusBarItem: null,
  sidebarWebviewView: null,
  insertCodes: '',
  diffCodes: 'aaa',
}
