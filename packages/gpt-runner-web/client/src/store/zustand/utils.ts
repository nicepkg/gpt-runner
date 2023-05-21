import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import cloneDeep from 'lodash-es/cloneDeep'
import { EnvConfig } from '../../../../env-config'

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

export function createStore(devtoolsName: string) {
  const newCreate = (store: any) => {
    const defaultState = create(store).getState()
    let result: any

    // https://github.com/pmndrs/zustand/issues/852#issuecomment-1059783350
    if (EnvConfig.get('NODE_ENV') === 'development') {
      result = create(
        devtools(store, {
          name: devtoolsName,
          anonymousActionType: `${devtoolsName}/Action`,
        }),
      )
    }

    result = create(store)

    // reset state of this store
    result.resetState = () => {
      result.setState(cloneDeep(defaultState), true)
    }

    // add resetState to resetStateQueue
    resetStateQueue.push(result.resetState.bind(result))

    return result
  }

  return newCreate as typeof create
}
