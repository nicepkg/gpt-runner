import type { NotificationConfig } from '@nicepkg/gpt-runner-shared/common'

export const notificationConfig: NotificationConfig = {
  createAt: '2023-07-24 23:31:22',
  title: 'GPT Runner Notification',
  message: 'v1.2.0 is release',
}

export const cnNotificationConfig: NotificationConfig = {
  createAt: '2023-07-24 23:31:26',
  title: 'GPT Runner 通知',
  message: `
### 版本更新到了 v1.2.0
1. 重启 vscode 即可去扩展处更新
2. cli 的执行 \`npm i -g gptr\` 即可更新

### 本次功能更新
1. 针对语言为简体中文的用户提供 OpenAI API key 供应商，也就是你可以白嫖了。
2. 点击左上角设置，切换供应商即可。
3. 本次 API Key 由慷慨大方的 \`剑廿三\` 提供，让我们把掌声送给他。

### 交流
1. 想进群交流的加 wechat: \`qq2214962083\`
  `,
}
