import { createGlobalStyle } from 'styled-components'
import { themeMap } from './themes'

function buildThemeCssString(themes: typeof themeMap) {
  let finalThemeString = ''

  for (const [themeName, theme] of Object.entries(themes)) {
    const themeString = Object.entries(theme)
      .map(([key, value]) => `${key}: ${value};`)
      .join('\n')

    finalThemeString += `
      body[data-theme="${themeName}"] > * {
        ${themeString}
      }

      ${theme['--background']
        ? `
          body {
            background: ${theme['--background']} !important;
          }
              `
        : ''}
    `
  }

  finalThemeString += `

    #root {
      background: var(--background);
      color: var(--foreground);
    }
  `

  return finalThemeString
}

export const GlobalThemeStyle = createGlobalStyle`
  ${buildThemeCssString(themeMap)}
`
