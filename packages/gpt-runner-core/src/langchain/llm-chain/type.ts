import type { ChatModel, SingleChatMessage } from '@nicepkg/gpt-runner-shared/common'
import type { BaseStreamChainParams } from '../types'

export interface GetLLMChainParams extends BaseStreamChainParams<SingleChatMessage> {
  model: ChatModel
}
