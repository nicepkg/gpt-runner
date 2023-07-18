export interface BaseStreamChainParams<Message> {
  messages: Message[]
  systemPrompt?: string
  systemPromptAsUserPrompt?: boolean
  onTokenStream?: (token: string) => void
  onComplete?: () => void
  onError?: (err: any) => void
}
