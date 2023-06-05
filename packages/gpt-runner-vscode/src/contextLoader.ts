import { EventEmitter } from 'eventemitter3'

export interface IdeContext {

}

export class ContextLoader {
  public cwd: string
  public ready: Promise<void>
  public context: IdeContext

  public emitter = new EventEmitter<{
    reload: () => void
    contextLoaded: (context: IdeContext) => void
    contextReload: (context: IdeContext) => void
    contextUnload: (context: IdeContext) => void
  }>()

  constructor(cwd: string) {
    this.cwd = cwd
    this.context = {}
    this.ready = this.reload()
  }

  async reload() {
    this.emitter.emit('contextReload', this.context)
  }

  async unloadContext() {
    this.context = {}

    this.emitter.emit('contextUnload', this.context)
  }
}
