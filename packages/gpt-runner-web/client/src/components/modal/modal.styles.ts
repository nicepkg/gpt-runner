import { styled } from 'styled-components'
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react'
import { motion } from 'framer-motion'
import { Icon } from '../icon'

export const ModalWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  font-size: var(--type-ramp-base-font-size);
  color: var(--foreground);
`

export const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  max-height: 80vh;
  width: min(500px, calc(100vw - 1rem));
  overflow: hidden;
  background: var(--panel-view-background);
  border-radius: 0.5rem;
  position: relative;
  user-select: text;
`

export const ModalContentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 1rem;
  flex-shrink: 0;
  width: 100%;
`

export const ModalContentFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 1rem;
  padding: 1rem;
  flex-shrink: 0;
  width: 100%;
`

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 1rem;
`

export const ModalTitle = styled.div`
  width: 100%;
  font-size: 1.2rem;
`

export const CloseButton = styled(Icon)`
  margin-left: 1rem;
`

export const StyledFooterButton = styled(VSCodeButton)`
  border-radius: 0.25rem;
`
