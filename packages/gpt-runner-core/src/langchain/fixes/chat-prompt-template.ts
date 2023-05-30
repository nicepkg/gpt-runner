import { ChatPromptTemplate } from 'langchain/prompts'
import type { BaseChatMessage, InputValues } from 'langchain/schema'

ChatPromptTemplate.prototype.formatMessages = async function (values: InputValues): Promise<BaseChatMessage[]> {
  const allValues = await this.mergePartialAndUserVariables(values)
  let resultMessages: BaseChatMessage[] = []
  for (const promptMessage of this.promptMessages) {
    const inputValues = promptMessage.inputVariables.reduce((acc, inputVariable) => {
      if (!(inputVariable in allValues)) {
        // throw new Error(`Missing value for input variable \`${inputVariable}\``)
        return acc
      }

      acc[inputVariable] = allValues[inputVariable]
      return acc
    }, {} as InputValues)
    const message = await promptMessage.formatMessages(inputValues)
    resultMessages = resultMessages.concat(message)
  }
  return resultMessages
}
