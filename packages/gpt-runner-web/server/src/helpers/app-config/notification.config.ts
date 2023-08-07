import type { NotificationConfig } from '@nicepkg/gpt-runner-shared/common'

export const notificationConfig: NotificationConfig = {
  createAt: '2023-08-06 18:37:10',
  title: 'GPT Runner Notification',
  message: 'v1.2.2 is release',
}

export const cnNotificationConfig: NotificationConfig = {
  createAt: '2023-08-06 18:37:06',
  title: 'GPT Runner 通知',
  message: `
### 🚀 新版 v1.2.2 (2023-08-06)

> vscode 用户重启 vscode 后即可在扩展处更新。
>
> cli 用户执行 \`npm update -g gptr\` 即可更新。

1. 针对语言为简体中文的用户提供 OpenAI API key 第三方供应商，也就是你可以白嫖了。
2. 点击左上角设置，切换供应商即可。
3. 本次 API Key 由慷慨大方的 \`朝云云\` 提供，让我们把掌声送给他。

### 💬 交流

1. 想进群交流的加 wechat: \`qq2214962083\`
2. 所有捐赠 API Key 的朋友，都可以在这里免费展示 50 字以内的广告直到 API Key 失效，如果你也想捐赠 API Key，可以联系我。
3. 此处广告仅供展示，与 GPT-Runner 无关，**若有财产交易，请自行承担风险**

### 📢 YunAI - AI驱动的WEB对话应用 (朝云云供应商广告)

🔵 [**点击进入**](https://faschat.zyai.online/)注册即送大量3.5使用次数

如需适配 GPT-Runner 的 4.0-32k 或 Claude 接口服务，可 VX 联系：\`YunAi0101\`

  `,
}
