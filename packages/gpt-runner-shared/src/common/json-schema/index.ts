import { zodToJsonSchema } from 'zod-to-json-schema'
import { SingleFileConfigSchema, UserConfigForUserSchema } from '../zod'

export const userConfigJsonSchema = zodToJsonSchema(UserConfigForUserSchema)
export const singleFileJsonSchema = zodToJsonSchema(SingleFileConfigSchema)
