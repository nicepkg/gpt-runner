import { Headers, Request, Response, fetch } from 'undici'
import 'web-streams-polyfill/polyfill'
import { canUseNodeFetchWithoutCliFlag } from './check-node-version'

export function addNodejsPolyfill() {
  if (!canUseNodeFetchWithoutCliFlag()) {
    console.log('GPT Runner: add polyfill for fetch', process.version)
    // polyfill for nodejs < 18.0.0
    globalThis.fetch = fetch as any
    globalThis.Headers = Headers as any
    globalThis.Request = Request as any
    globalThis.Response = Response as any
  }
}
