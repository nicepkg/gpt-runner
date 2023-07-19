import type { ChatModel, SingleChatMessage } from '@nicepkg/gpt-runner-shared/common'
import type { BaseModelParams } from '../types'

export interface GetModelParams extends BaseModelParams<SingleChatMessage> {
  model: ChatModel
}
