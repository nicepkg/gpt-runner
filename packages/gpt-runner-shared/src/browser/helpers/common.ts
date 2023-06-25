export function getSearchParams(val: string, url?: string): string {
  const defaultUrl = typeof window !== 'undefined' ? window.location.href : ''
  const finalUrl = url || defaultUrl || ''
  const searchParams = finalUrl.split('?')?.[1] || ''
  const params = new URLSearchParams(searchParams)
  return params.get(val) || ''
}

export function addSearchParams(urlLike: string,
  searchParams: Record<string, any>) {
  const [urlBase = '', urlSearch = ''] = urlLike.split('?')
  const params = new URLSearchParams(urlSearch)
  Object.keys(searchParams).forEach((key) => {
    params.set(key, searchParams[key])
  })
  const urlSearchParams = params.toString()
  if (!urlSearchParams)
    return urlBase
  return `${urlBase}?${urlSearchParams}`
}

export function removeSearchParams(urlLike: string,
  searchParamKeys: string[]) {
  const [urlBase = '', urlSearch = ''] = urlLike.split('?')
  const params = new URLSearchParams(urlSearch)
  searchParamKeys.forEach((key) => {
    params.delete(key)
  })
  const urlSearchParams = params.toString()
  if (!urlSearchParams)
    return urlBase
  return `${urlBase}?${urlSearchParams}`
}

export function copy(text: string) {
  navigator.clipboard.writeText(text)
}
