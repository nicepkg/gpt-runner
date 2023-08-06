import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { useGlobalStore } from '../store/zustand/global'

interface RgbaColor {
  r: number
  g: number
  b: number
  a: number
}

// A helper function to convert RGB to boolean indicating if color is dark
function isColorDark(rgba: RgbaColor | null): boolean {
  if (!rgba)
    return false

  // https://stackoverflow.com/questions/11867545/change-text-color-based-on-brightness-of-the-covered-background-area
  const brightness = Math.round(((rgba.r * 299) + (rgba.g * 587) + (rgba.b * 114)) / 1000)
  return brightness <= 125
}

// Helper function to convert hex color to RGB
function hexToRGBA(hex: string): RgbaColor | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: parseInt(result[4], 16) || 1,
      }
    : null
}

export interface GetCssVarColorInfoProps {
  element: HTMLElement | null
  cssVarName: string
}

interface GetCssVarColorInfoResult {
  rgba: RgbaColor | null
  isDark: boolean
}

export function getCssVarColorInfo(props: GetCssVarColorInfoProps): GetCssVarColorInfoResult {
  const { element, cssVarName } = props

  let rgba: RgbaColor | null = null
  let isDark = false

  if (element) {
    const colorValue = getComputedStyle(element).getPropertyValue(cssVarName).trim()

    if (colorValue.startsWith('#')) {
      const result = hexToRGBA(colorValue)
      rgba = result
    }
    else {
      const rgbaArr = colorValue.match(/\d+/g)?.map(Number)
      if (rgbaArr && rgbaArr.length >= 3) {
        const [r, g, b, a = 1] = rgbaArr
        rgba = { r, g, b, a }
      }
    }
    isDark = isColorDark(rgba)
  }

  return { rgba, isDark }
}

export function isDarkTheme() {
  const { isDark } = getCssVarColorInfo({ element: document.body, cssVarName: '--panel-view-background' })
  return isDark
}

export type UseCssVarColorProps = Omit<GetCssVarColorInfoProps, 'element'> & {
  elementRef?: React.RefObject<HTMLElement>
}

export type UseCssVarColorResult = GetCssVarColorInfoResult & {
  updateColor: () => void
}

export function useCssVarColor(props: UseCssVarColorProps): UseCssVarColorResult {
  const { elementRef: elementRefFromProps, cssVarName } = props

  const elementRefFromPrivate = useRef<HTMLElement>(document.body)
  const elementRef = elementRefFromProps || elementRefFromPrivate
  const hasElement = (elementRefFromProps ? elementRefFromProps.current : elementRefFromPrivate.current) instanceof HTMLElement

  const [rgba, setRgbColor] = useState<RgbaColor | null>(null)
  const [isDark, setIsDark] = useState(false)
  const { themeName } = useGlobalStore()

  const updateColor = useCallback(() => {
    const app = document.querySelector<HTMLElement>('#root')
    if (app)
      elementRefFromPrivate.current = app

    if (!hasElement)
      return

    const { rgba, isDark } = getCssVarColorInfo({ element: elementRef.current, cssVarName })
    setRgbColor(rgba)
    setIsDark(isDark)
  }, [cssVarName, hasElement, elementRef.current])

  useLayoutEffect(() => {
    if (!hasElement)
      return

    updateColor()
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes')
          updateColor()
      }
    })

    observer.observe(document.body, { attributes: true })

    return () => observer.disconnect()
  }, [updateColor, hasElement, themeName])

  return { rgba, isDark, updateColor }
}

export function useDarkTheme(): boolean {
  const { isDark } = useCssVarColor({ cssVarName: '--panel-view-background' })

  return isDark
}
