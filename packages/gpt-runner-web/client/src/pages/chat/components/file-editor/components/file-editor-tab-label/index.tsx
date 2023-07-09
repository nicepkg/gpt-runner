import { memo, useCallback } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { FileItemRenderInfo } from '../../shared'
import { getIconComponent } from '../../../../../../helpers/file-icons/utils'
import { useHover } from '../../../../../../hooks/use-hover.hook'
import type { FileEditorItem } from '../../../../../../store/zustand/file-editor/file-editor-item'
import { useModal } from '../../../../../../hooks/use-modal.hook'
import { useKeyIsPressed } from '../../../../../../hooks/use-keyboard.hook'
import { openEditor } from '../../../../../../networks/editor'
import { StyledRightIcon, TabLabelCenter, TabLabelLeft, TabLabelRight, TabLabelWrapper } from './file-editor-tab-label.styles'

export interface FileEditorTabLabelProps {
  fileItemRenderInfo: FileItemRenderInfo
  onItemUpdate?: (item: FileEditorItem) => void
  onRemoveItem?: (item: FileEditorItem) => void
  onSave?: (item: FileEditorItem) => void
}

export const FileEditorTabLabel: FC<FileEditorTabLabelProps> = memo((props) => {
  const { fileItemRenderInfo, onItemUpdate, onRemoveItem, onSave } = props

  const { t } = useTranslation()
  const { setModalProps } = useModal()
  const [rightIconRef, isRightIconHovering] = useHover()
  const isPressedCtrl = useKeyIsPressed(['ctrl', 'command'])

  const renderMaterialIconComponent = useCallback((fileItemRenderInfo: FileItemRenderInfo | undefined) => {
    if (!fileItemRenderInfo)
      return null

    const { fileName } = fileItemRenderInfo

    const MaterialSvgComponent = getIconComponent({
      isFolder: false,
      name: fileName,
    })

    if (!MaterialSvgComponent)
      return null

    return <MaterialSvgComponent style={{
      marginLeft: '0.25rem',
      marginRight: '0.25rem',
      width: '1rem',
      height: '1rem',
      flexShrink: '0',
    }} />
  }, [])

  const { displayTitle, item, fileName } = fileItemRenderInfo

  if (!fileItemRenderInfo)
    return null

  return <TabLabelWrapper title={item.fullPath} onClick={() => {
    if (isPressedCtrl) {
      openEditor({
        path: item.fullPath,
      })
    }
  }}>

    {/* left */}
    <TabLabelLeft>
      {renderMaterialIconComponent(fileItemRenderInfo)}
    </TabLabelLeft>

    {/* center */}
    <TabLabelCenter
      $fixed={item.fixed}
      onDoubleClick={() => {
        if (!item.fixed) {
          onItemUpdate?.({
            ...item,
            fixed: true,
          })
        }
      }}
    >
      {displayTitle}
    </TabLabelCenter>

    {/* right */}
    <TabLabelRight>
      <StyledRightIcon
        ref={rightIconRef}
        className={
          item.editingContent !== item.sourceContent && !isRightIconHovering
            ? 'codicon-circle-filled'
            : 'codicon-chrome-close'}
        onClick={() => {
          if (item.editingContent === item.sourceContent) {
            onRemoveItem?.(item)
            return
          }

          setModalProps({
            open: true,
            title: t('chat_page.file_editor_forgot_save_tips_title', {
              fileName,
            }),
            children: t('chat_page.file_editor_forgot_save_tips_content'),
            okText: t('chat_page.save_btn'),
            cancelText: t('chat_page.do_not_save_btn'),
            onCancel() {
              setModalProps({ open: false })
              onRemoveItem?.(item)
            },
            async onOk() {
              await onSave?.(item)
              setModalProps({ open: false })
              onRemoveItem?.(item)
            },
          })
        }}
      ></StyledRightIcon>
    </TabLabelRight>
  </TabLabelWrapper>
})

FileEditorTabLabel.displayName = 'FileEditorTabLabel'
