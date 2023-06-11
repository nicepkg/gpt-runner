export type Lang = 'en' | 'zh-CN'
export const DEFAULT_LOCALE = 'en'

// for browser
if (typeof process === 'undefined' && typeof window !== 'undefined') {
  (window as any).process = {
    env: {},
  }
}

const isNetlify = Boolean(process.env.NETLIFY)
export const ENV = {
  isNetlify,
  siteName: process.env.SITE_NAME,
  isDev: process.env.NODE_ENV === 'development',
  isDeployPreview: isNetlify && process.env.CONTEXT === 'deploy-preview',
  isBranchDeploy: isNetlify && process.env.CONTEXT === 'branch-deploy',
  isBuildFast: Boolean(process.env.BUILD_FAST),
  baseUrl: process.env.BASE_URL ?? '/',
  isI18nStaging: process.env.I18N_STAGING === 'true',
  currentLocale: (process.env.CURRENT_LOCALE ?? DEFAULT_LOCALE) as Lang,

  crowdinToken: process.env.CROWDIN_PERSONAL_TOKEN,
}

// export const THEME_COLOR = '#19c37d'
export const THEME_COLOR = 'rgb(25,195,125)'
export const ORG_NAME = 'nicepkg'
export const PROJECT_NAME = 'gpt-runner'
export const PROJECT_DISPLAY_NAME = 'GPT Runner'
export const GITHUB_LINK = `https://github.com/${ORG_NAME}/${PROJECT_NAME}`
export const SITE_URL = 'http://gpt-runner.nicepkg.cn'
