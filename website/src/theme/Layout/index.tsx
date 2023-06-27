import React from 'react'
import Layout from '@theme-original/Layout'
import type { Props } from '@theme/Layout'

// This component is only used to test for CSS insertion order
import './styles.module.css'

export default function LayoutWrapper(props: Props): JSX.Element {
  return <Layout {...props} />
}
