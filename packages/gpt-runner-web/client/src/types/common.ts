import type { Component } from 'react'

export type GetComponentProps<T> = T extends Component<infer P> ? P : never

export interface BaseResponse<T = any> {
  type: 'Success' | 'Fail'
  status?: number
  message?: string
  data?: T
}
