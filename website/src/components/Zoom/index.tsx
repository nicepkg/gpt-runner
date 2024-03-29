import React from 'react'
import { useColorMode } from '@docusaurus/theme-common'
import BasicZoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export default function Zoom({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  const { colorMode } = useColorMode()
  return (
    <BasicZoom
      overlayBgColorEnd={
        colorMode === 'dark'
          ? 'rgba(0, 0, 0, 0.95)'
          : 'rgba(255, 255, 255, 0.95)'
      }>
      {children}
    </BasicZoom>
  )
}
