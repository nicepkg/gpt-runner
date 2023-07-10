import { gptrLightTheme } from './gptr-light.theme'
import { gptrDarkTheme } from './gptr-dark.theme'
import { jetbrainsDarkTheme } from './jetbrains-dark.theme'
import { jetbrainsLightTheme } from './jetbrains-light.theme'
import type { Theme } from './vscode-dark.theme'
import { vscodeDarkTheme } from './vscode-dark.theme'
import { vscodeLightTheme } from './vscode-light.theme'

export const themeMap = {
  default: gptrDarkTheme,
  gptrLight: gptrLightTheme,
  gptrDark: gptrDarkTheme,
  vscodeDynamic: {} as Theme,
  vscodeDark: vscodeDarkTheme,
  vscodeLight: vscodeLightTheme,
  jetbrainsDark: jetbrainsDarkTheme,
  jetbrainsLight: jetbrainsLightTheme,
} as const

export function isDarkTheme(themeName: ThemeName) {
  const darkThemes: ThemeName[] = ['default', 'gptrDark', 'vscodeDynamic', 'vscodeDark', 'jetbrainsDark']
  return darkThemes.includes(themeName)
}

export type ThemeName = keyof typeof themeMap
