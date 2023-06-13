import type * as vscode from 'vscode'

export interface State {
  serverPort: number | null
  statusBarItem: vscode.StatusBarItem | null
  sidebarWebviewView: vscode.WebviewView | null
  webviewPanel: vscode.WebviewPanel | null
  activeEditor: vscode.TextEditor | null
  insertCodes: string
  diffCodes: string
}

export const state: State = {
  serverPort: null,
  statusBarItem: null,
  sidebarWebviewView: null,
  webviewPanel: null,
  activeEditor: null,
  insertCodes: '',
  diffCodes: 'aaa',
}
