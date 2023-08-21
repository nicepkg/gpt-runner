import { ChatMessageStatus } from '@nicepkg/gpt-runner-shared/common'
import type { MaybePartial, SingleChat } from '@nicepkg/gpt-runner-shared/common'
import { v4 as uuidv4 } from 'uuid'
import { DEFAULT_CHAT_NAME } from '../../helpers/constant'
import { BaseEntity, EntityEvent } from './base.entity'

export interface ChatEntityJson extends SingleChat {
}

export class ChatEntity extends BaseEntity<ChatEntityJson> {
  protected getDefaultJson(): ChatEntityJson {
    return {
      id: uuidv4(),
      name: DEFAULT_CHAT_NAME,
      inputtingPrompt: '',
      systemPrompt: '',
      messages: [],
      aiPersonFileSourcePath: '',
      status: ChatMessageStatus.Success,
      createAt: Date.now(),
    }
  }
}

export interface ChatListEntityJson {
  chats: ChatEntityJson[]
}

export class ChatListEntity<Json extends ChatListEntityJson = ChatListEntityJson> extends BaseEntity<Json> {
  protected getDefaultJson(): Json {
    return {
      chats: [] as ChatEntityJson[],
    } as Json
  }

  private get chats() {
    return this.getData().chats
  }

  get chatEntities(): ChatEntity[] {
    return this.chats.map((chat) => {
      const entity = new ChatEntity(chat)
      entity.on(EntityEvent.Update, () => this.emitUpdate())
      return entity
    })
  }

  isChatExists(id: string): boolean {
    return this.chats.some(chat => chat.id === id)
  }

  findChatByCondition(condition: (chat: ChatEntityJson) => boolean): ChatEntityJson | undefined {
    const entityJson = this.chats.find(condition)
    return entityJson
  }

  findChatById(id: string): ChatEntityJson | undefined {
    return this.findChatByCondition(chat => chat.id === id)
  }

  addChat(chatEntityJson: MaybePartial<ChatEntityJson>): void {
    const entityJson = new ChatEntity(chatEntityJson).toJSON()

    if (this.isChatExists(entityJson.id))
      throw new Error(`Chat entity already exists:  ${JSON.stringify(entityJson, null, 2)}`)

    this.setData(preState => ({
      ...preState,
      chats: [...preState.chats, entityJson],
    }))
  }

  updateChatById(id: string, chatEntityJson: ChatEntityJson | ((chat: ChatEntityJson) => ChatEntityJson)): void {
    if (!this.isChatExists(id))
      return

    this.setData(preState => ({
      ...preState,
      chats: preState.chats.map((chat) => {
        if (chat.id === id) {
          const entityJson = typeof chatEntityJson === 'function' ? chatEntityJson(chat) : chatEntityJson
          return entityJson
        }

        return chat
      }),
    }))
  }

  removeChatById(id: string): void {
    this.setData(preState => ({
      ...preState,
      chats: preState.chats.filter(chat => chat.id !== id),
    }))
  }
}
