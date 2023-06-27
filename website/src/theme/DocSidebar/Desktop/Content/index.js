import React from 'react'
import { useLocation } from '@docusaurus/router'
import Content from '@theme-original/DocSidebar/Desktop/Content'

function SidebarAd() {
  return (
    <div style={{ border: 'solid thin red', padding: 10, textAlign: 'center' }}>
      Sidebar Ad
    </div>
  )
}

export default function ContentWrapper(props) {
  const { pathname } = useLocation()
  const shouldShowSidebarAd = pathname.includes('/tests/')
  return (
    <>
      {shouldShowSidebarAd && <SidebarAd />}
      <Content {...props} />
      {shouldShowSidebarAd && <SidebarAd />}
    </>
  )
}
