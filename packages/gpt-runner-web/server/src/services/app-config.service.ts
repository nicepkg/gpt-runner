import type { AppConfig, ChatModelType, CommonAppConfig, CurrentAppConfig, GetModelConfigType, LastVisitModalDateRecord, MarkedAsVisitedType } from '@nicepkg/gpt-runner-shared/common'
import { EnvConfig, LocaleLang, ServerStorageName } from '@nicepkg/gpt-runner-shared/common'
import merge from 'lodash-es/merge'
import cloneDeep from 'lodash-es/cloneDeep'
import { getStorage } from '@nicepkg/gpt-runner-shared/node'
import { decode } from 'js-base64'

export class AppConfigService implements CurrentAppConfig {
  static _instance: AppConfigService
  static REMOTE_CONFIG_LINK = 'https://raw.githubusercontent.com/nicepkg/gpt-runner/main/packages/gpt-runner-web/assets/app-config.json'
  static UNSAFE_SECRETS_KEY = ['apiKey', 'accessToken']
  static LAST_VISIT_MODAL_DATE_KEY = 'last-visit-modal-date'
  private loadAppConfigPromise?: Promise<AppConfig>
  private langId: LocaleLang

  public showNotificationModal: boolean
  public showReleaseModal: boolean
  public appConfig?: AppConfig | undefined

  public get currentConfig(): CommonAppConfig | undefined {
    if (!this.appConfig)
      return undefined
    return AppConfigService.mergeAndGetCurrentAppConfig(this.appConfig, this.langId)
  }

  static get instance(): AppConfigService {
    if (!AppConfigService._instance)
      AppConfigService._instance = new AppConfigService()

    return AppConfigService._instance
  }

  constructor() {
    this.langId = LocaleLang.English
    this.showNotificationModal = false
    this.showReleaseModal = false
  }

  static async getAppConfig(): Promise<AppConfig> {
    return EnvConfig.get('NODE_ENV') === 'development' ? (await import('../../../assets/app-config.json')).default : await fetch(`${AppConfigService.REMOTE_CONFIG_LINK}?timestamp=${Date.now()}`).then(res => res.json())
  }

  static mergeAndGetCurrentAppConfig(appConfig: AppConfig, currentLang: LocaleLang): CommonAppConfig {
    const commonConfig = appConfig.common
    const currentLangConfig = appConfig[currentLang]

    if (!currentLangConfig)
      return commonConfig

    const finalAppConfig: CommonAppConfig = merge({}, commonConfig, currentLangConfig)

    return finalAppConfig
  }

  updateLangId(langId: LocaleLang) {
    this.langId = langId
  }

  async getStorage() {
    const { storage } = await getStorage(ServerStorageName.GlobalState)
    return storage
  }

  async getCurrentAppConfig(safe = true): Promise<CurrentAppConfig | null> {
    if (!this.appConfig)
      await this.loadAppConfig()

    if (!this.appConfig)
      return null

    await this.updateShouldShowModal()

    const result = {
      showNotificationModal: this.showNotificationModal,
      showReleaseModal: this.showReleaseModal,
      currentConfig: this.currentConfig,
    }

    const unsafeSecretKey = AppConfigService.UNSAFE_SECRETS_KEY

    if (result.currentConfig) {
      const oldVendorsConfig = result.currentConfig.vendorsConfig
      const newVendorsConfig = cloneDeep(oldVendorsConfig)

      Object.entries(oldVendorsConfig).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((modelVendorConfig, modelVendorConfigIndex) => {
            Object.entries(modelVendorConfig?.vendorSecrets || {}).forEach(([secretKey, secretValue]) => {
              if (unsafeSecretKey.includes(secretKey)) {
                const decodedSecretValue = decode(String(secretValue || ''))
                ;(newVendorsConfig as any)[key][modelVendorConfigIndex].vendorSecrets[secretKey] = safe ? '*'.repeat(decodedSecretValue.length) : decodedSecretValue
              }
            })
          })
        }
      })

      result.currentConfig.vendorsConfig = newVendorsConfig
    }

    return result
  }

  async getSecretsConfig<T extends ChatModelType>(props: {
    modelType: T
    vendorName: string
  }): Promise<GetModelConfigType<T, 'secrets'> | undefined> {
    if (!this.appConfig)
      await this.loadAppConfig()

    const { modelType, vendorName } = props
    const { currentConfig } = await this.getCurrentAppConfig(false) || {}
    let result: GetModelConfigType<T, 'secrets'> | undefined

    if (currentConfig) {
      const modelVendors = currentConfig.vendorsConfig[modelType]
      result = modelVendors?.find(vendor => vendor.vendorName === vendorName)?.vendorSecrets
    }

    return result
  }

  async loadAppConfig(): Promise<void> {
    if (this.appConfig)
      return

    try {
      if (!this.loadAppConfigPromise)
        this.loadAppConfigPromise = AppConfigService.getAppConfig()

      const appConfig = await this.loadAppConfigPromise
      this.appConfig = appConfig || null
    }
    catch (e) {
      console.error(e)
    }
    finally {
      this.loadAppConfigPromise = undefined
    }
  }

  async updateShouldShowModal(): Promise<void> {
    if (!this.appConfig)
      await this.loadAppConfig()

    if (!this.appConfig) {
      this.showNotificationModal = false
      this.showReleaseModal = false
      return
    }

    const currentConfig = this.currentConfig
    const storage = await this.getStorage()

    const lastVisitModalDateRecord: LastVisitModalDateRecord | undefined | null = await storage.get(AppConfigService.LAST_VISIT_MODAL_DATE_KEY)

    const notificationDateFromConfig = currentConfig?.notificationConfig?.createAt
    const notificationDateFromStorage = lastVisitModalDateRecord?.notificationDate

    const releaseDateFromConfig = currentConfig?.releaseConfig?.createAt
    const releaseDateFromStorage = lastVisitModalDateRecord?.releaseDate

    /**
     * date like 2021-02-03 12:30:21
     * return a is after b
     */
    const dateIsAfter = (a: string | undefined | null, b: string | undefined | null, defaultValue = false) => {
      if (!a || !b)
        return defaultValue

      const aDate = new Date(a).getTime()
      const bDate = new Date(b).getTime()
      return aDate > bDate
    }

    this.showNotificationModal = dateIsAfter(notificationDateFromConfig, notificationDateFromStorage, true)
    this.showReleaseModal = dateIsAfter(releaseDateFromConfig, releaseDateFromStorage, true)
  }

  async markedAsVisited(types: MarkedAsVisitedType[]): Promise<void> {
    const storage = await this.getStorage()
    const currentConfig = this.currentConfig
    const notificationDate = currentConfig?.notificationConfig?.createAt
    const releaseDate = currentConfig?.releaseConfig?.createAt
    const oldValue = await storage.get(AppConfigService.LAST_VISIT_MODAL_DATE_KEY) || {}
    const newValue = {
      ...oldValue,
    }

    if (types.includes('notificationDate'))
      newValue.notificationDate = notificationDate

    if (types.includes('releaseDate'))
      newValue.releaseDate = releaseDate

    await storage.set(AppConfigService.LAST_VISIT_MODAL_DATE_KEY, newValue)
  }
}
