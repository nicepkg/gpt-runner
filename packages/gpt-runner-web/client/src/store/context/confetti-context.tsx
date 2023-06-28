import { createContext, useRef } from 'react'
import type { ReactNode } from 'react'
import type { ConfettiRef } from '../../components/confetti'
import { Confetti } from '../../components/confetti'

interface ConfettiContextProviderProps {
  children: ReactNode
}

export interface IConfettiContext {
  runConfettiAnime: () => void
}

export const ConfettiContext = createContext<IConfettiContext | null>(null)

export function ConfettiProvider({ children }: ConfettiContextProviderProps) {
  const confettiRef = useRef<ConfettiRef>(null)

  const context: IConfettiContext = {
    runConfettiAnime: () => confettiRef.current?.runConfettiAnime?.(),
  }

  return (
    <ConfettiContext.Provider value={context}>
      <Confetti ref={confettiRef} config={{ angle: 90, spread: 360, startVelocity: 40, elementCount: 70, dragFriction: 0.12, duration: 3000, stagger: 3, width: '10px', height: '10px', perspective: '500px' }} />
      {children}
    </ConfettiContext.Provider>
  )
}
