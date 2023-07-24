import type { VendorsConfig } from '@nicepkg/gpt-runner-shared/common'
import { ChatModelType } from '@nicepkg/gpt-runner-shared/common'

export const vendorsConfig: VendorsConfig = {
  createAt: '2023-07-24 23:40:49',
  [ChatModelType.Openai]: [],
  [ChatModelType.Anthropic]: [],
}

export const cnVendorsConfig: VendorsConfig = {
  createAt: '2023-07-24 23:40:49',
  [ChatModelType.Openai]: [{
    vendorName: 'xabcai',
    vendorSecrets: {
      basePath: 'https://api.xabcai.com/v1',
      // don't forgot it should be base64
      apiKey: 'c2stWHZQeGJQMVBySFduZDJFZ0xpa0lKTlQzOTNoc3pZdDdmN0NNZUozSE1pdkw2QVdx',
    },
  }],
  [ChatModelType.Anthropic]: [],
}
