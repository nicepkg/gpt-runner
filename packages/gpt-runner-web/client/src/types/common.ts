import type { Component } from 'react'

export type GetComponentProps<T> = T extends Component<infer P> ? P : never
