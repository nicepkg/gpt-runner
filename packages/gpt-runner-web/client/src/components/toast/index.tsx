import { memo } from 'react'
import { Toaster } from 'react-hot-toast'

export const Toast = memo((props) => {
  const { toastOptions, ...otherProps } = props
  return <Toaster
    {...otherProps}
    toastOptions={{
      ...toastOptions,
      style: {
        border: '1px solid var(--foreground)',
        padding: '0.5rem',
        fontSize: '1rem',
        color: 'var(--foreground)',
        background: 'var(--panel-view-background)',
        borderRadius: '0.5rem',
      },
    }}
    {...props} />
}) as typeof Toaster

Toast.displayName = 'Toast'
