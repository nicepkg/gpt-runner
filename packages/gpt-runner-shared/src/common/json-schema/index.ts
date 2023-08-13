import { zodToJsonSchema } from 'zod-to-json-schema'
import { AiPresetFileConfigSchema, UserConfigForUserSchema } from '../zod'

export const userConfigJsonSchema = zodToJsonSchema(UserConfigForUserSchema)
export const aiPresetFileJsonSchema = zodToJsonSchema(AiPresetFileConfigSchema)
