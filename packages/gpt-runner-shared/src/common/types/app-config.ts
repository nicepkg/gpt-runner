import type { GetModelConfigType } from './config'
import type { ChatModelType, LocaleLang, VendorTag } from './enum'

export type MarkdownString = string

export interface BaseConfig {
  /**
   * create time like 2023-04-23 12:34:56, for diff update
   */
  createAt: string
}

export interface ChangeLogConfig {
  /**
   * like 2023-04-23 12:34:56
   */
  releaseDate: string
  version: string
  changes: MarkdownString
}

export interface ReleaseConfig extends BaseConfig {
  changeLogs: ChangeLogConfig[]
}

export interface NotificationConfig extends BaseConfig {
  title: string
  message: MarkdownString
}

export interface BaseApiVendor {
  vendorName: string
  vendorShortDescription?: string
  vendorOfficialUrl?: string
  vendorLogoUrl?: string
  vendorDescription?: MarkdownString
  vendorTags?: VendorTag[]
}

export type ModelApiVendor<T extends ChatModelType> = BaseApiVendor & {
  vendorSecrets?: GetModelConfigType<T, 'secrets'>
}

export type ModelTypeVendorsMap = {
  [Key in ChatModelType]?: ModelApiVendor<Key>[]
}

export interface VendorsConfig extends BaseConfig, ModelTypeVendorsMap {
}

export interface CommonAppConfig {
  notificationConfig: NotificationConfig
  releaseConfig: ReleaseConfig
  vendorsConfig: VendorsConfig
}

export type AppConfig = {
  common: CommonAppConfig
} & {
  [K in LocaleLang]?: Partial<CommonAppConfig>
}

export interface CurrentAppConfig {
  showNotificationModal: boolean
  showReleaseModal: boolean
  currentConfig?: CommonAppConfig
}

export interface LastVisitModalDateRecord {
  notificationDate?: string
  releaseDate?: string
}

export type MarkedAsVisitedType = keyof LastVisitModalDateRecord
