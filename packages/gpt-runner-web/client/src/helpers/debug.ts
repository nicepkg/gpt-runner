import debug from 'debug'

export class Debug {
  static instance: Debug
  private debugger: debug.Debugger
  private label: string

  constructor(label: string) {
    this.label = `gpt-runner:${label}`
    debug.enable(this.label)
    this.debugger = debug(this.label)
    this.debugger.useColors = true
    this.debugger.color = String(debug.selectColor(this.label))
  }

  static getInstance(label = 'default'): Debug {
    if (!Debug.instance)
      Debug.instance = new Debug(label)

    return Debug.instance
  }

  log(message: string, ...args: unknown[]) {
    this.debugger(message, ...args)
  }

  warn(message: string, ...args: unknown[]) {
    this.debugger(`[WARN]: ${message}`, ...args)
  }

  error(message: string, ...args: unknown[]) {
    this.debugger(`[ERROR]: ${message}`, ...args)
  }
}
