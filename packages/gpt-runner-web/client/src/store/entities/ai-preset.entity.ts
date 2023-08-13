import { AiPresetTreeItemType, travelTree } from '@nicepkg/gpt-runner-shared/common'
import type { AiPresetInfo, MaybePartial, TreeItem } from '@nicepkg/gpt-runner-shared/common'
import { ChatEntity, ChatListEntity } from './chat.entity'
import type { ChatEntityJson, ChatListEntityJson } from './chat.entity'
import type { BaseEntityOptions } from './base.entity'
import { BaseEntity } from './base.entity'

export interface AiPresetEntityJson extends ChatListEntityJson {
  presetInfo: AiPresetInfo
}

export class AiPresetEntity extends ChatListEntity<AiPresetEntityJson> {
  protected override getDefaultJson(): AiPresetEntityJson {
    return {
      presetInfo: {
        sourcePath: '',
        groupPath: '',
        name: '',
        type: AiPresetTreeItemType.File,
        content: '',
        aiPresetFileConfig: {},
      },
      chats: [],
    }
  }

  private get presetInfo() {
    return this.getData().presetInfo
  }

  addChat(chatEntityJson: MaybePartial<ChatEntityJson>) {
    if (this.presetInfo.type !== AiPresetTreeItemType.File)
      return

    super.addChat({
      ...chatEntityJson,
      aiPresetFileSourcePath: this.presetInfo.sourcePath,
    })
  }

  updateChatById(id: string, chatEntityJson: MaybePartial<ChatEntityJson> | ((chat: ChatEntityJson) => ChatEntityJson)): void {
    if (this.presetInfo.type !== AiPresetTreeItemType.File)
      return

    const entityJson = typeof chatEntityJson === 'function' ? chatEntityJson(this.findChatByCondition(chat => chat.id === id)!) : new ChatEntity(chatEntityJson).toJson()
    super.updateChatById(id, {
      ...entityJson,
      aiPresetFileSourcePath: this.presetInfo.sourcePath,
    })
  }
}

export type AiPresetEntityJsonTreeItem = TreeItem<AiPresetEntityJson>

export interface AiPresetTreeEntityJson {
  activeChatId: string
  treeItems: AiPresetEntityJsonTreeItem[]
}

export class AiPresetTreeEntity extends BaseEntity<AiPresetTreeEntityJson> {
  protected override getDefaultJson(): AiPresetTreeEntityJson {
    return {
      activeChatId: '',
      treeItems: [],
    }
  }

  private groupPathItemMap: Map<string, AiPresetEntityJsonTreeItem> = new Map()
  private sourcePathMap: Map<string, AiPresetEntityJsonTreeItem> = new Map()
  private chatIdItemMap: Map<string, AiPresetEntityJsonTreeItem> = new Map()

  private get activeChatId() {
    return this.getData().activeChatId
  }

  private get treeItems() {
    return this.getData().treeItems
  }

  get activeItem(): AiPresetEntityJsonTreeItem | undefined {
    return this.findItemByChatId(this.activeChatId)
  }

  get activeItemEntity(): AiPresetEntity | undefined {
    return this.findItemEntityByChatId(this.activeChatId)
  }

  constructor(json?: MaybePartial<AiPresetTreeEntityJson>, options: BaseEntityOptions<AiPresetTreeEntityJson> = {}) {
    const { handleSetData } = options

    const finalHandleSetData = (data: AiPresetTreeEntityJson) => {
      this.updateMapFromItems(data.treeItems)
      handleSetData?.(data)
    }
    super(json, { ...options, handleSetData: finalHandleSetData })
  }

  private updateMapFromItem(item: AiPresetEntityJsonTreeItem) {
    this.groupPathItemMap.set(item.presetInfo.groupPath, item)

    if (item.presetInfo.type === AiPresetTreeItemType.File) {
      this.sourcePathMap.set(item.presetInfo.sourcePath, item)
      item.chats.forEach(chat => this.chatIdItemMap.set(chat.id, item))
    }
  }

  private updateMapFromItems(treeItems: AiPresetEntityJsonTreeItem[]): void {
    travelTree(treeItems, (item) => {
      this.updateMapFromItem(item)
    })
  }

  findItemByChatId(chatId: string): AiPresetEntityJsonTreeItem | undefined {
    return this.chatIdItemMap.get(chatId)
  }

  findItemEntityByChatId(chatId: string): AiPresetEntity | undefined {
    const item = this.findItemByChatId(chatId)
    return item
      ? new AiPresetEntity(item, {
        sourceJsonAsData: true,
        handleSetData: (data) => {
          this.updateMapFromItem(data)
          this.setData(this.getData())
        },
      })
      : undefined
  }
}
