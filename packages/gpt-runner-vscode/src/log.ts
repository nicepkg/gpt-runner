import { window } from 'vscode'
import { EXT_DISPLAY_NAME } from './constant'

export const log = window.createOutputChannel(EXT_DISPLAY_NAME)
