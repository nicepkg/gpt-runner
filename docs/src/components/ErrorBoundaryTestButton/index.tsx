import React, { type ReactNode, useState } from 'react'

export default function ErrorBoundaryTestButton({
  children = 'Boom!',
}: {
  children?: ReactNode
}): JSX.Element {
  const [state, setState] = useState(false)
  if (state)
    throw new Error('Boom!\nSomething bad happened, but you can try again!')

  return (
    <button type="button" onClick={() => setState(true)}>
      {children}
    </button>
  )
}
