export const EXT_NAME = 'gpt-runner'
export const EXT_DISPLAY_NAME = 'GPT Runner'

export enum Commands {
  Reload = `${EXT_NAME}.reload`,
  RestartServer = `${EXT_NAME}.restartServer`,
  OpenInBrowser = `${EXT_NAME}.openInBrowser`,
  InsertCodes = `${EXT_NAME}.insertCodes`,
  DiffCodes = `${EXT_NAME}.diffCodes`,
}

export const URI_SCHEME = 'gpt-runner'
