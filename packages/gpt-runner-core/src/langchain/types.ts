export interface BaseStreamChainParams<Message> {
  messages: Message[]
  systemPrompt?: string
  onTokenStream?: (token: string) => void
  onComplete?: () => void
  onError?: (err: any) => void
}
