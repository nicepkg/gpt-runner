import { zodToJsonSchema } from 'zod-to-json-schema'
import { AiPersonConfigSchema, GlobalAiPersonConfigForUserSchema } from '../zod'

export const globalAiPersonConfigJsonSchema = zodToJsonSchema(GlobalAiPersonConfigForUserSchema)
export const aiPersonJsonSchema = zodToJsonSchema(AiPersonConfigSchema)
