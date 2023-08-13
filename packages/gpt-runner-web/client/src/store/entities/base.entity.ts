import type { MaybePartial } from '@nicepkg/gpt-runner-shared/common'
import defaults from 'lodash-es/defaults'

export interface BaseEntityOptions<Json extends Record<string, any>> {
  sourceJsonAsData?: boolean
  handleSetData?: (data: Json) => void
}

export abstract class BaseEntity<Json extends Record<string, any>> {
  private _data!: Json
  private _handleSetData?: (data: Json) => void

  protected abstract getDefaultJson(): Json

  constructor(json?: MaybePartial<Json>, options: BaseEntityOptions<Json> = {}) {
    const { sourceJsonAsData = false, handleSetData } = options

    this._handleSetData = handleSetData
    this.fromJson(json ?? {}, !sourceJsonAsData)
  }

  setData(data: Json | ((data: Json) => Json)): void {
    this._data = typeof data === 'function' ? data(this._data) : data
    this._handleSetData?.(this._data)
  }

  getData(): Json {
    return this._data
  }

  fromJson(json: MaybePartial<Json>, withDefaults = true): void {
    if (withDefaults)
      this.setData(defaults(json, this.getDefaultJson()))

    else
      this.setData(json as Json)
  }

  fromEntity(jsonOrEntity: BaseEntity<Json>): void {
    if (jsonOrEntity instanceof BaseEntity)
      this.fromJson(jsonOrEntity.toJson())
  }

  toJson(): Json {
    return JSON.parse(JSON.stringify(this.getData()))
  }
}
