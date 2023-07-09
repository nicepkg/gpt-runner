import type { ReactNode } from 'react'
import { memo, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { FlexColumnCenter } from '../../styles/global.styles'
import { CloseButton, ModalContent, ModalContentFooter, ModalContentHeader, ModalContentWrapper, ModalTitle, ModalWrapper, StyledFooterButton } from './modal.styles'

export interface ModalProps {
  open: boolean
  title?: ReactNode
  zIndex?: number
  cancelText?: string
  okText?: string
  showCancelBtn?: boolean
  showOkBtn?: boolean
  showCloseIcon?: boolean
  footerCenterButtons?: {
    text: string
    onClick: () => void
  }[]
  contentWidth?: string
  children?: ReactNode
  onCancel?: () => void
  onOk?: () => void
}

export const Modal = memo(({
  open,
  title = '',
  zIndex = 10,
  cancelText,
  okText,
  showCancelBtn = true,
  showOkBtn = true,
  showCloseIcon = true,
  footerCenterButtons = [],
  contentWidth,
  children,
  onCancel,
  onOk,
}: ModalProps) => {
  const [isOpen, setIsOpen] = useState(open)
  const { t } = useTranslation()

  const finalCancelText = cancelText ?? t('chat_page.cancel_btn')
  const finalOkText = okText ?? t('chat_page.ok_btn')

  useEffect(() => {
    setIsOpen(open)
  }, [open])

  return createPortal(
    <ModalWrapper
      style={{
        zIndex,
        display: isOpen ? 'flex' : 'none',
      }}
    >
      <ModalContentWrapper
        style={{
          width: contentWidth,
        }}
      >
        <ModalContentHeader>
          <ModalTitle>{title}</ModalTitle>
          {showCloseIcon && <FlexColumnCenter style={{ fontSize: '1.2rem' }}>
            <CloseButton className='codicon-close' onClick={onCancel}></CloseButton>
          </FlexColumnCenter>}
        </ModalContentHeader>

        <ModalContent>
          {children}
        </ModalContent>

        <ModalContentFooter>
          {showCancelBtn && <StyledFooterButton
            onClick={onCancel}>
            {finalCancelText}
          </StyledFooterButton>}

          {footerCenterButtons.map((btn, index) => (
            <StyledFooterButton
              key={index}
              style={{
                marginLeft: '1rem',
              }}
              onClick={btn.onClick}>
              {btn.text}
            </StyledFooterButton>
          ))}

          {showOkBtn && <StyledFooterButton
            style={{
              marginLeft: '1rem',
            }}
            onClick={onOk}>
            {finalOkText}
          </StyledFooterButton>}
        </ModalContentFooter>

      </ModalContentWrapper>
    </ModalWrapper>,
    document.body,
  )
})

Modal.displayName = 'Modal'
