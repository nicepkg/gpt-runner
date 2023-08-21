import type { MaybePartial } from '@nicepkg/gpt-runner-shared/common'
import defaults from 'lodash-es/defaults'
import EventEmitter from 'eventemitter3'

export enum EntityEvent {
  Update = 'update',
}

export interface EventMap<Json extends Record<string, any>> {
  [EntityEvent.Update]: (data: Json) => void
}

export abstract class BaseEntity<Json extends Record<string, any>> extends EventEmitter<EventMap<Json>> {
  private _data!: Json

  protected abstract getDefaultJson(): Json

  constructor(json?: MaybePartial<Json>) {
    super()
    this.fromJSON(json ?? {})
  }

  emitUpdate() {
    this.emit(EntityEvent.Update, this._data)
  }

  setData(data: Json | ((data: Json) => Json)): void {
    this._data = typeof data === 'function' ? data(this._data) : data
    this.emitUpdate()
  }

  getData(): Json {
    return this._data
  }

  fromJSON(json: MaybePartial<Json>): void {
    this.setData(defaults(json, this.getDefaultJson()))
  }

  fromEntity(jsonOrEntity: BaseEntity<Json>): void {
    if (jsonOrEntity instanceof BaseEntity)
      this.fromJSON(jsonOrEntity.toJSON())
  }

  toJSON(): Json {
    return JSON.parse(JSON.stringify(this.getData()))
  }

  dispose(): void {
    this.removeAllListeners()
  }
}
