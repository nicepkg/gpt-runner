export interface BaseModelParams<Message> {
  streaming?: boolean
  messages?: Message[]
  systemPrompt?: string
  systemPromptAsUserPrompt?: boolean
  buildRequestHeaders?: (url: string, requestHeaders: Record<string, string> | undefined) => Record<string, string> | void
  onTokenStream?: (token: string) => void
  onComplete?: () => void
  onError?: (err: any) => void
}
