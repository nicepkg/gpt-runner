import '../fixes'

import { initializeAgentExecutorWithOptions } from 'langchain/agents'
import type { StructuredTool } from 'langchain/tools'
import type { GetModelParams } from './type'
import { getModel } from './get-model'
import { getCurdFilesAgent } from './agents/curd-files.agent'

export interface StructChainParams extends GetModelParams {}

export async function getStructDataChain(params: StructChainParams) {
  const llm = getModel(params)

  const tools: StructuredTool[] = [
    getCurdFilesAgent(),
  ]

  const chain = await initializeAgentExecutorWithOptions(tools, llm, {
    agentType: 'structured-chat-zero-shot-react-description',
  })

  return chain
}
