import type * as vscode from 'vscode'

export interface State {
  sidebarWebviewView: vscode.WebviewView | null
  insertCodes: string
}

export const state: State = {
  sidebarWebviewView: null,
  insertCodes: '',
}
