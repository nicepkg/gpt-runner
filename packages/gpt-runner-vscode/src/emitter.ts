import type { EventEmitterMap } from '@nicepkg/gpt-runner-shared/common'
import { ClientEventName } from '@nicepkg/gpt-runner-shared/common'
import { EventEmitter } from 'eventemitter3'
import { commands } from 'vscode'
import { state } from './state'
import { Commands } from './constant'

export enum EventType {
  ReceiveMessage = 'ReceiveMessage',
}

const __emitter__ = new EventEmitter<EventEmitterMap>()

// rewrite emit method to send message to webview
const oldEmit = __emitter__.emit
__emitter__.emit = function (...args) {
  const [eventName, eventData, type] = args

  if (type !== EventType.ReceiveMessage)
    state.sidebarWebviewView?.webview.postMessage({ eventName, eventData })

  return oldEmit.apply(this, args as any)
}

// insert codes
__emitter__.on(ClientEventName.InsertCodes, ({ codes }) => {
  state.insertCodes = codes
  commands.executeCommand(Commands.InsertCodes)
})

export const emitter = __emitter__
