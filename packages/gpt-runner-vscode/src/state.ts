import type * as vscode from 'vscode'

export interface State {
  serverPort: number | null
  statusBarItem: vscode.StatusBarItem | null
  sidebarWebviewView: vscode.WebviewView | null
  webviewPanels: Set<vscode.WebviewPanel>
  activeEditor: vscode.TextEditor | null
  insertCodes: string
  diffCodes: string
  openingFilePaths: string[]
  activeFilePath: string
  selectedText: string
}

export const state: State = {
  serverPort: null,
  statusBarItem: null,
  sidebarWebviewView: null,
  webviewPanels: new Set(),
  activeEditor: null,
  insertCodes: '',
  diffCodes: '',
  openingFilePaths: [],
  activeFilePath: '',
  selectedText: '',
}
