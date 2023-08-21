import type { StateCreator } from 'zustand'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import cloneDeep from 'lodash-es/cloneDeep'
import { EnvConfig } from '@nicepkg/gpt-runner-shared/common'
import { type BaseEntity, EntityEvent } from '../entities/base.entity'

/**
 * The resetStateQueue is an array that holds callbacks to reset all stores.
 * This is used to reset the state of all stores when resetAllState is called.
 */
const resetStateQueue: (() => void)[] = []

/**
 * reset all state of all stores
 */
export function resetAllState() {
  resetStateQueue.forEach(resetState => resetState())
}

export function createStore(devtoolsName: string, connectToDevTools = true) {
  const newCreate = (store: any) => {
    let result: any

    // https://github.com/pmndrs/zustand/issues/852#issuecomment-1059783350
    if (EnvConfig.get('NODE_ENV') === 'development' && connectToDevTools) {
      result = create(
        devtools(store, {
          name: devtoolsName,
          anonymousActionType: `${devtoolsName}/Action`,
        }),
      )
    }
    else {
      result = create(store)
    }

    // reset state of this store
    result.resetState = () => {
      const defaultState = create(store).getState()
      result.setState(cloneDeep(defaultState), true)
    }

    // add resetState to resetStateQueue
    resetStateQueue.push(result.resetState.bind(result))

    return result
  }

  return newCreate as typeof create
}

export function createSliceCreatorFromEntity<T extends BaseEntity<any>>(entity: T): StateCreator<T, [], [], T> {
  return (set, get) => {
    Object.keys(entity).forEach((key) => {
      const val = entity[key as keyof T]
      const isFunction = typeof val === 'function'

      if (isFunction) {
        entity[key as keyof T] = function (...args: any[]) {
          return (val as any).apply(get(), args)
        } as any
      }
    })

    entity.on(EntityEvent.Update, () => set({}))

    return entity as T
  }
}
