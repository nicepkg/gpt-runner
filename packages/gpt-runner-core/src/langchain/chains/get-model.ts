import type { BaseLanguageModel } from 'langchain/dist/base_language'
import { ChatModelType } from '@nicepkg/gpt-runner-shared/common'
import type { GetModelParams } from './type'
import { getAnthropicModel } from './models/anthropic.model'
import { getHuggingFaceModel } from './models/hugging-face.model'
import { getOpenaiModel } from './models/openai.model'

export function getModel(params: GetModelParams): BaseLanguageModel {
  const getModelFns: ((params: GetModelParams) => BaseLanguageModel | null)[] = [
    getAnthropicModel,
    getHuggingFaceModel,
    getOpenaiModel,
  ]

  if (!params.model.type) {
    Object.assign(params.model, {
      type: ChatModelType.Openai,
    })
  }

  for (const getModelFn of getModelFns) {
    const llm = getModelFn(params)
    if (llm)
      return llm
  }

  throw new Error(`No LLM provided, model type ${params.model.type}`)
}
