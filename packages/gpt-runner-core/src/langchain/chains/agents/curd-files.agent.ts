import { DynamicStructuredTool } from 'langchain/tools'
import { z } from 'zod'

export function getCurdFilesAgent() {
  return new DynamicStructuredTool({
    name: 'curd-files',
    description: 'Please extract the core information of curd files based on your own answer to the user, and I will  Create, update, read, and delete files based on the core information you gave. You need to give full file path and file content to me',
    schema: z.object({
      data: z.array(z.object({
        type: z.enum(['create', 'update', 'read', 'delete']).describe('The type of operation to perform'),
        filePath: z.string().describe('The path to the file to be edited'),
        content: z.string().optional().describe('The content to be written to the file'),
      })).optional().default([]).describe('The operations to perform on the files'),
    }),
    func: async ({ data }) => {
      console.log('----------data', data)
      return JSON.stringify(data)
    },
  })
}
