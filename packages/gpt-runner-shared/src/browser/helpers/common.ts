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

export function unsecuredCopyToClipboard(text: string) {
  const textArea = document.createElement('textarea')
  textArea.value = text
  Object.assign(textArea.style, {
    position: 'fixed',
    right: '0',
    bottom: '0',
    opacity: '0',
    width: '0',
    height: '0',
    pointerEvents: 'none',
  })

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  try {
    document.execCommand('copy')
  }
  catch (err) {
    throw new Error(`Unable to copy to clipboard${err}`)
  }
  document.body.removeChild(textArea)
}

export async function copyToClipboard(content: string) {
  if (window.isSecureContext && navigator.clipboard)
    await navigator.clipboard.writeText(content)
  else
    unsecuredCopyToClipboard(content)
}
