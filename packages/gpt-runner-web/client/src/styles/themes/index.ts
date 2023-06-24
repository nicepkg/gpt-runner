import { jetbrainsDarkTheme } from './jetbrains-dark.theme'
import { jetbrainsLightTheme } from './jetbrains-light.theme'
import { vscodeDarkTheme } from './vscode-dark.theme'
import { vscodeLightTheme } from './vscode-light.theme'

export const themeMap = {
  default: {},
  vscodeDark: vscodeDarkTheme,
  vscodeLight: vscodeLightTheme,
  jetbrainsDark: jetbrainsDarkTheme,
  jetbrainsLight: jetbrainsLightTheme,
} as const

export function isDarkTheme(themeName: ThemeName) {
  const darkThemes: ThemeName[] = ['default', 'vscodeDark', 'jetbrainsDark']
  return darkThemes.includes(themeName)
}

export type ThemeName = keyof typeof themeMap
