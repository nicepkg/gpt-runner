import { AiPersonTreeItemType } from '@nicepkg/gpt-runner-shared/common'
import type { AiPersonTreeItemInfo, MaybePartial } from '@nicepkg/gpt-runner-shared/common'
import { ChatEntity, ChatListEntity } from './chat.entity'
import type { ChatEntityJson, ChatListEntityJson } from './chat.entity'

export interface AiPersonTreeItemEntityJson extends ChatListEntityJson {
  aiPersonTreeItemInfo: AiPersonTreeItemInfo
}

export class AiPersonTreeItemEntity extends ChatListEntity<AiPersonTreeItemEntityJson> {
  protected override getDefaultJson(): AiPersonTreeItemEntityJson {
    return {
      aiPersonTreeItemInfo: {
        sourcePath: '',
        categoryPath: '',
        name: '',
        type: AiPersonTreeItemType.File,
        content: '',
        aiPersonConfig: {},
      },
      chats: [],
    }
  }

  private get aiPersonTreeItemInfo() {
    return this.getData().aiPersonTreeItemInfo
  }

  addChat(chatEntityJson: MaybePartial<ChatEntityJson>) {
    if (this.aiPersonTreeItemInfo.type !== AiPersonTreeItemType.File)
      return

    super.addChat({
      ...chatEntityJson,
      aiPersonFileSourcePath: this.aiPersonTreeItemInfo.sourcePath,
    })
  }

  updateChatById(id: string, chatEntityJson: MaybePartial<ChatEntityJson> | ((chat: ChatEntityJson) => ChatEntityJson)): void {
    if (this.aiPersonTreeItemInfo.type !== AiPersonTreeItemType.File)
      return

    const entityJson = typeof chatEntityJson === 'function' ? chatEntityJson(this.findChatByCondition(chat => chat.id === id)!) : new ChatEntity(chatEntityJson).toJSON()
    super.updateChatById(id, {
      ...entityJson,
      aiPersonFileSourcePath: this.aiPersonTreeItemInfo.sourcePath,
    })
  }
}
