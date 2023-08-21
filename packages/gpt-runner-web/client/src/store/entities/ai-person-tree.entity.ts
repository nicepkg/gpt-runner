import { AiPersonTreeItemType, type MaybePartial, type TreeItem, travelTree } from '@nicepkg/gpt-runner-shared/common'
import { AiPersonTreeItemEntity } from './ai-person.entity'
import type { AiPersonTreeItemEntityJson } from './ai-person.entity'
import { BaseEntity, EntityEvent } from './base.entity'

export type AiPersonTreeItemEntityJsonTreeItem = TreeItem<AiPersonTreeItemEntityJson>

export interface AiPersonTreeEntityJson {
  activeChatId: string
  treeItems: AiPersonTreeItemEntityJsonTreeItem[]
}

export class AiPersonTreeEntity extends BaseEntity<AiPersonTreeEntityJson> {
  protected override getDefaultJson(): AiPersonTreeEntityJson {
    return {
      activeChatId: '',
      treeItems: [],
    }
  }

  private categoryPathItemMap: Map<string, AiPersonTreeItemEntityJsonTreeItem> = new Map()
  private sourcePathMap: Map<string, AiPersonTreeItemEntityJsonTreeItem> = new Map()
  private chatIdItemMap: Map<string, AiPersonTreeItemEntityJsonTreeItem> = new Map()

  private get activeChatId() {
    return this.getData().activeChatId
  }

  private get treeItems() {
    return this.getData().treeItems
  }

  get activeItem(): AiPersonTreeItemEntityJsonTreeItem | undefined {
    return this.findItemByChatId(this.activeChatId)
  }

  get activeItemEntity(): AiPersonTreeItemEntity | undefined {
    return this.findItemEntityByChatId(this.activeChatId)
  }

  constructor(json?: MaybePartial<AiPersonTreeEntityJson>) {
    super(json)
    this.on(EntityEvent.Update, data => this.updateMapFromItems(data.treeItems))
  }

  private updateMapFromItem(item: AiPersonTreeItemEntityJsonTreeItem) {
    this.categoryPathItemMap.set(item.aiPersonTreeItemInfo.categoryPath, item)

    if (item.aiPersonTreeItemInfo.type === AiPersonTreeItemType.File) {
      this.sourcePathMap.set(item.aiPersonTreeItemInfo.sourcePath, item)
      item.chats.forEach(chat => this.chatIdItemMap.set(chat.id, item))
    }
  }

  private updateMapFromItems(treeItems: AiPersonTreeItemEntityJsonTreeItem[]): void {
    travelTree(treeItems, (item) => {
      this.updateMapFromItem(item)
    })
  }

  findItemByChatId(chatId: string): AiPersonTreeItemEntityJsonTreeItem | undefined {
    return this.chatIdItemMap.get(chatId)
  }

  findItemEntityByChatId(chatId: string): AiPersonTreeItemEntity | undefined {
    const item = this.findItemByChatId(chatId)

    if (item) {
      const entity = new AiPersonTreeItemEntity(item)

      entity.on(EntityEvent.Update, (data) => {
        this.updateMapFromItem(data)
        this.emitUpdate()
      })

      return entity
    }
    return undefined
  }
}
