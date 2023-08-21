import { z } from 'zod'
import { AiPersonTreeItemType, ChatMessageStatus, ChatModelType, ChatRole, ClientEventName, LocaleLang, ServerStorageName } from '../types'

export const ChatModelTypeSchema = z.nativeEnum(ChatModelType)

export const ChatRoleSchema = z.nativeEnum(ChatRole)

export const ChatMessageStatusSchema = z.nativeEnum(ChatMessageStatus)

export const ClientEventNameSchema = z.nativeEnum(ClientEventName)

export const AiPersonTreeItemTypeSchema = z.nativeEnum(AiPersonTreeItemType)

export const ServerStorageNameSchema = z.nativeEnum(ServerStorageName)

export const LocaleLangSchema = z.nativeEnum(LocaleLang)
