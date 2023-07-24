import type { CSSProperties, ReactNode } from 'react'
import { memo, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, type Variants } from 'framer-motion'
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
  contentStyle?: CSSProperties
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
  contentStyle,
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

  const modalAnimation: Variants = useMemo(() => ({
    hidden: {
      opacity: 0,
      y: 50,
      display: 'none',
    },
    visible: { opacity: 1, y: 0, display: 'flex' },
    exit: {
      opacity: 0,
      y: 50,
      transitionEnd: {
        display: 'none',
      },
    },
  }), [])

  const showFooter = showCancelBtn || showOkBtn || footerCenterButtons.length > 0

  return createPortal(
    <AnimatePresence>
      <ModalWrapper
        style={{
          zIndex,
        }}
        initial={'hidden'}
        animate={isOpen ? 'visible' : 'hidden'}
        exit={'exit'}
        variants={modalAnimation}
      >
        <ModalContentWrapper style={contentStyle}>
          <ModalContentHeader>
            <ModalTitle>{title}</ModalTitle>
            {showCloseIcon && <FlexColumnCenter style={{ fontSize: '1.2rem' }}>
              <CloseButton className='codicon-close' onClick={onCancel}></CloseButton>
            </FlexColumnCenter>}
          </ModalContentHeader>

          <ModalContent style={{
            paddingBottom: showFooter ? '0' : '1rem',
          }}>
            {children}
          </ModalContent>

          {showFooter && <ModalContentFooter>
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
          </ModalContentFooter>}
        </ModalContentWrapper>
      </ModalWrapper>
    </AnimatePresence>,
    document.body,
  )
})

Modal.displayName = 'Modal'
