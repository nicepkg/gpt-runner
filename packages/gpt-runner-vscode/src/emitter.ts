import type { EventEmitterMap } from '@nicepkg/gpt-runner-shared/common'
import { ClientEventName } from '@nicepkg/gpt-runner-shared/common'
import { EventEmitter } from 'eventemitter3'
import { commands } from 'vscode'
import { state } from './state'
import { Commands } from './constant'

export enum EventType {
  ReceiveMessage = 'ReceiveMessage',
}

const emitter = new EventEmitter<EventEmitterMap>()

// rewrite emit method to send message to webview
const oldEmit = emitter.emit
emitter.emit = function (...args) {
  const [eventName, eventData, type] = args

  if (type !== EventType.ReceiveMessage) {
    state.sidebarWebviewView?.webview.postMessage({ eventName, eventData })
    state.webviewPanels.forEach((webviewPanel) => {
      webviewPanel?.webview.postMessage({ eventName, eventData })
    })
  }

  return oldEmit.apply(this, args as any)
}

// insert codes
emitter.on(ClientEventName.InsertCodes, ({ codes }) => {
  state.insertCodes = codes
  commands.executeCommand(Commands.InsertCodes)
})

// diff codes
emitter.on(ClientEventName.DiffCodes, ({ codes }) => {
  state.diffCodes = codes
  commands.executeCommand(Commands.DiffCodes)
})

export { emitter }
