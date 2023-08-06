import type { VendorsConfig } from '@nicepkg/gpt-runner-shared/common'
import { ChatModelType } from '@nicepkg/gpt-runner-shared/common'

export const vendorsConfig: VendorsConfig = {
  createAt: '2023-07-24 23:40:49',
  [ChatModelType.Openai]: [],
  [ChatModelType.Anthropic]: [],
}

export const cnVendorsConfig: VendorsConfig = {
  createAt: '2023-08-06 18:37:22',
  [ChatModelType.Openai]: [{
    vendorName: '朝云云供应商',
    vendorSecrets: {
      basePath: 'http://8.130.89.91:3000/v1',
      // don't forgot it should be base64
      apiKey: 'c2stQUlBc2NTUGk2RVR0cXVSVThmMmYzODU1NTk4NzQ4M2U4YjE1QWU4MzEwMjMxZTRi',
    },
  }],
  [ChatModelType.Anthropic]: [],
}
