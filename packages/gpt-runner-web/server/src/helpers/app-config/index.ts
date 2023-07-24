import type { AppConfig } from '@nicepkg/gpt-runner-shared/common'
import { LocaleLang } from '@nicepkg/gpt-runner-shared/common'
import { cnNotificationConfig, notificationConfig } from './notification.config'
import { releaseConfig } from './release.config'
import { cnVendorsConfig, vendorsConfig } from './vendors.config'

export const appConfig: AppConfig = {
  common: {
    notificationConfig,
    releaseConfig,
    vendorsConfig,
  },
  [LocaleLang.ChineseSimplified]: {
    notificationConfig: cnNotificationConfig,
    vendorsConfig: cnVendorsConfig,
  },
}
