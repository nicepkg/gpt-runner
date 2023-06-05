import { EventEmitter } from 'eventemitter3'
import { GlobalConfig } from '../helpers/global-config';
import { EventEmitterMap } from '@nicepkg/gpt-runner-shared/common';

declare global {
  namespace debug {
    interface Debugger {
      useColors: boolean;
    }
  }

  interface Window {
      __emitter__?: InstanceType<typeof EventEmitter<EventEmitterMap>>
      __GLOBAL_CONFIG__?: Partial<GlobalConfig>
      __DEFAULT_GLOBAL_CONFIG__?: GlobalConfig
      setGlobalConfig: (config: Partial<GlobalConfig>) => void
      getGlobalConfig: () => GlobalConfig
  }
}
