import type { WssControllerConfig } from '../../types'
import { storageControllers } from './storage.ws-controller'

export const allWsControllersConfig: WssControllerConfig[] = [storageControllers]
