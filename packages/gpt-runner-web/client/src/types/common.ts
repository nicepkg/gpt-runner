import type { Component } from 'react'
import type React from 'react'

export type GetComponentProps<T> = T extends Component<infer P> ? P : never

export type SvgComponent = React.FunctionComponent<
React.ComponentProps<'svg'> & { title?: string }
>
