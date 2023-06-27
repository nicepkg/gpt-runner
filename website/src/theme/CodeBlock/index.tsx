import React from 'react'
import CodeBlock from '@theme-original/CodeBlock'
import type { Props } from '@theme/CodeBlock'

// This component does nothing on purpose
// Dogfood: wrapping a theme component already enhanced by another theme
// See https://github.com/facebook/docusaurus/pull/5983
export default function CodeBlockWrapper(props: Props): JSX.Element {
  return <CodeBlock {...props} />
}
