import React from 'react'
import OriginalToggle from '@theme-original/ColorModeToggle'
import {
  COLOR_SHADES,
  type ColorState,
  DARK_BACKGROUND_COLOR,
  DARK_PRIMARY_COLOR,
  LIGHT_BACKGROUND_COLOR,
  LIGHT_PRIMARY_COLOR,
  darkStorage,
  lightStorage,
  updateDOMColors,
} from '@site/src/utils/colorUtils'
import type { Props } from '@theme/ColorModeToggle'

// The ColorGenerator modifies the DOM styles. The styles are persisted in
// session storage, and we need to apply the same style when toggling modes even
// when we are not on the styling-layout page. The only way to do this so far is
// by hooking into the Toggle component.
export default function ColorModeToggle(props: Props): JSX.Element {
  return (
    <OriginalToggle
      {...props}
      onChange={(colorMode) => {
        props.onChange(colorMode)
        const isDarkMode = colorMode === 'dark'
        const storage = isDarkMode ? darkStorage : lightStorage
        const colorState = (JSON.parse(
          storage.get() ?? 'null',
        ) as ColorState | null) ?? {
          baseColor: isDarkMode ? DARK_PRIMARY_COLOR : LIGHT_PRIMARY_COLOR,
          background: isDarkMode
            ? DARK_BACKGROUND_COLOR
            : LIGHT_BACKGROUND_COLOR,
          shades: COLOR_SHADES,
        }
        updateDOMColors(colorState, isDarkMode)
      }}
    />
  )
}
