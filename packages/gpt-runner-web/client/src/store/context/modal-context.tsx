import type { ReactNode } from 'react'
import React, { createContext, useState } from 'react'
import { Modal, type ModalProps } from '../../components/modal'

interface IModalContext {
  modalProps: ModalProps
  setModalProps: (props: ModalProps) => void
}

export const ModalContext = createContext<IModalContext | undefined>(undefined)

interface ModalProviderProps {
  children: ReactNode
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalProps, setModalProps] = useState<ModalProps>({
    open: false,
    title: '',
  })

  return (
    <ModalContext.Provider value={{ modalProps, setModalProps }}>
      <Modal {...modalProps} />

      {children}
    </ModalContext.Provider>
  )
}
