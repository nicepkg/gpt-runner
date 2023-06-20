import launch from 'launch-editor'
import { FileUtils } from './file-utils'

// see: https://github.com/yyx990803/launch-editor/blob/master/packages/launch-editor/get-args.js
export type LaunchEditorName = 'Atom' | 'Atom Beta' | 'subl' | 'sublime' | 'sublime_text'
| 'wstorm' | 'charm' | 'notepad++' | 'vim' | 'mvim' | 'joe'
| 'gvim' | 'emacs' | 'emacsclient' | 'rmate' | 'mate' | 'mine'
| 'Code' | 'Code - Insiders' | 'codium' | 'vscodium' | 'VSCodium'
| 'appcode' | 'clion' | 'clion64' | 'idea' | 'idea64' | 'phpstorm'
| 'phpstorm64' | 'pycharm' | 'pycharm64' | 'rubymine' | 'rubymine64'
| 'webstorm' | 'webstorm64' | 'goland' | 'goland64' | 'rider' | 'rider64'

export interface LaunchEditorParams {
  path: string
  lineNum?: number
  columnNum?: number
  editorName?: LaunchEditorName
  onError?: (error: any) => void
}

export async function launchEditor(params: LaunchEditorParams): Promise<void> {
  return new Promise((resolve, reject) => {
    const { path, lineNum, columnNum = 0, editorName, onError } = params

    const finalPath = lineNum && columnNum ? `${path}:${lineNum}:${columnNum}` : path

    launch(finalPath, editorName, (error) => {
      if (error) {
        onError?.(error)
        reject(error)
      }
    })

    resolve()
  })
}

export interface LaunchEditorByPathAndContentParams {
  path: string
  matchContent?: string
  editorName?: LaunchEditorName
  onError?: (error: any) => void
}

export async function launchEditorByPathAndContent(params: LaunchEditorByPathAndContentParams) {
  const { path, matchContent, editorName, onError } = params

  const content = await FileUtils.readFile({ filePath: path })
  let lineNum = 0
  let columnNum = 0

  if (matchContent) {
    // get line number and columnNum, matchContent is multiple lines text
    const matchContentStartIndex = content.indexOf(matchContent)

    if (matchContentStartIndex !== -1) {
      const beforeMatchContent = content.slice(0, matchContentStartIndex)
      lineNum = beforeMatchContent.split('\n').length
      columnNum = matchContentStartIndex - beforeMatchContent.lastIndexOf('\n')
    }
  }

  await launchEditor({ path, lineNum, columnNum, editorName, onError })

  return { lineNum, columnNum }
}
