import { ClientConfig } from "../../../types";
import { EventEmitter } from 'eventemitter3'

declare global {
  namespace debug {
    interface Debugger {
      useColors: boolean;
    }
  }

  interface Window {
      __config__?:  ClientConfig
      __emitter__?: InstanceType<typeof EventEmitter>
  }
}
