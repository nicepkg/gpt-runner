import type { BaseLanguageModel } from 'langchain/dist/base_language'
import { ChatModelType, getErrorMsg } from '@nicepkg/gpt-runner-shared/common'
import { HuggingFaceInference } from 'langchain/llms/hf'
import type { GetModelParams } from '../type'

export function getHuggingFaceModel(params: GetModelParams): BaseLanguageModel | null {
  const { model, onTokenStream, onComplete, onError } = params

  if (model.type === ChatModelType.HuggingFace) {
    const { secrets, modelName, temperature, maxTokens, topP, topK, frequencyPenalty } = model

    const huggingFaceModel = new HuggingFaceInference({
      // streaming: true,
      maxRetries: 1,
      apiKey: secrets?.apiKey,
      model: modelName,
      temperature,
      maxTokens,
      topP,
      topK,
      frequencyPenalty,
      // callbackManager: CallbackManager.fromHandlers({
      //   handleLLMNewToken: async (token: string) => {
      //     onTokenStream?.(token)
      //   },
      //   handleLLMEnd: async (output) => {
      //     onComplete?.()
      //   },
      //   handleLLMError: async (e) => {
      //     console.log('handleLLMError Error: ', e)
      //     onError?.(e)
      //   },
      //   handleChainError: async (err) => {
      //     if (err.message.includes('Could not parse LLM output: ')) {
      //       const output = err.message.split('Could not parse LLM output: ')[1]
      //       onTokenStream?.(`${output} \n\n`)
      //     }
      //     else {
      //       console.log('Chain Error: ', err)
      //       onError?.(err)
      //     }
      //   },
      // }),
    })

    const oldCall = huggingFaceModel._call
    huggingFaceModel._call = async function (...args) {
      try {
        const result = await oldCall.apply(this, args)
        onTokenStream?.(result)
        return result
      }
      catch (err) {
        onError?.(err)
        return getErrorMsg(err)
      }
      finally {
        onComplete?.()
      }
    }

    return huggingFaceModel
  }

  return null
}
