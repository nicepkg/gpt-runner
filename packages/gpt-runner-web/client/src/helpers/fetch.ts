import type { BaseResponse } from '@nicepkg/gpt-runner-shared/common'

export async function myFetch<T = any>(input: RequestInfo | URL, init?: RequestInit): Promise<BaseResponse<T>> {
  const fetchResult = await fetch(input, init)
  const res = await fetchResult.json() as BaseResponse<T>

  if (res.type === 'Fail')
    throw new Error(res.message)

  return res
}
