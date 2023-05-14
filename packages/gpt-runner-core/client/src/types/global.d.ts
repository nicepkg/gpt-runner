import { ClientConfig } from "../../../types";
import { EventEmitter } from 'eventemitter3'

declare global {
    interface Window {
        __config__?:  ClientConfig
        __emitter__?: InstanceType<typeof EventEmitter>
    }
}
