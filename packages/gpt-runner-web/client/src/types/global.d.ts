import { EventEmitter } from 'eventemitter3'

declare global {
  namespace debug {
    interface Debugger {
      useColors: boolean;
    }
  }

  interface Window {
      __emitter__?: InstanceType<typeof EventEmitter>
  }
}
