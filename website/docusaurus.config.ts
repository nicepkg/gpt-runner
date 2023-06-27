/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable operator-linebreak */
import remarkMath from 'remark-math'
import npm2yarn from '@docusaurus/remark-plugin-npm2yarn'
import lightTheme from 'prism-react-renderer/themes/github'
import darkTheme from 'prism-react-renderer/themes/vsDark'
import type { Options as ClientRedirectsOptions } from '@docusaurus/plugin-client-redirects'
import type { PluginOptions as IdealImageOptions } from '@docusaurus/plugin-ideal-image'
import type { Options as PwaOptions } from '@docusaurus/plugin-pwa'
import type { Options as ClassicOptions, ThemeConfig } from '@docusaurus/preset-classic'
import type { Options as ContentDocsOptions } from '@docusaurus/plugin-content-docs'
import type { Config } from '@docusaurus/types'
import configLocalized from './docusaurus.config.localized.json'
import configTabs from './src/remark/config-tabs'
import { DEFAULT_LOCALE, ENV, GITHUB_LINK, ORG_NAME, PROJECT_DISPLAY_NAME, PROJECT_NAME, SITE_URL, THEME_COLOR } from './constants'

function getLocalizedConfigValue(key: keyof typeof configLocalized) {
  const values = configLocalized[key]
  if (!values)
    throw new Error(`Localized config key=${key} not found`)

  const value = values[ENV.currentLocale] ?? values[DEFAULT_LOCALE]
  if (!value) {
    throw new Error(
      `Localized value for config key=${key} not found for both currentLocale=${ENV.currentLocale} or defaultLocale=${DEFAULT_LOCALE}`,
    )
  }
  return value
}

const config: Config = {
  title: `${PROJECT_DISPLAY_NAME} Documentation`,
  tagline: getLocalizedConfigValue('tagline'),
  organizationName: ORG_NAME,
  projectName: PROJECT_NAME,
  baseUrl: ENV.baseUrl,
  baseUrlIssueBanner: true,
  url: SITE_URL,
  trailingSlash: ENV.isDeployPreview,
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales:
      ENV.isDeployPreview || ENV.isBranchDeploy
        ? // Deploy preview and branch deploys: keep them fast!
          [DEFAULT_LOCALE]
        : ENV.isI18nStaging
          ? // Staging locales: https://gpt-runner-staging.nicepkg.cn/
            [DEFAULT_LOCALE, 'zh-CN']
          : // Production locales
            [DEFAULT_LOCALE, 'fr', 'pt-BR', 'ko', 'zh-CN'],
  },
  webpack: {
    jsLoader: isServer => ({
      loader: require.resolve('swc-loader'),
      options: {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          target: 'es2017',
        },
        module: {
          type: isServer ? 'commonjs' : 'es6',
        },
      },
    }),
  },
  markdown: {
    mermaid: true,
  },
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  customFields: {
    isDeployPreview: ENV.isDeployPreview,
    description:
      'An optimized site generator in React. Docusaurus helps you to move fast and write content. Build documentation websites, blogs, marketing pages, and more.',
  },
  staticDirectories: ['static'],
  plugins: [
    // require.resolve('@cmfcmf/docusaurus-search-local'),
    require.resolve('plugin-image-zoom'),
    require.resolve('@docusaurus/theme-mermaid'),
    [
      require.resolve('@docusaurus/plugin-client-redirects'),
      {
        fromExtensions: ['html'],
        createRedirects(routePath) {
          // Redirect to /docs from /docs/introduction (now docs root doc)
          if (routePath === '/docs' || routePath === '/docs/')
            return [`${routePath}/introduction`]

          return []
        },
      } satisfies ClientRedirectsOptions,
    ],
    [
      require.resolve('@docusaurus/plugin-content-docs'),
      {
        id: 'community',
        path: 'community',
        routeBasePath: 'community',
        editUrl: ({ locale, docPath }) => {
          if (locale !== DEFAULT_LOCALE)
            return `https://crowdin.com/project/${PROJECT_NAME}/${locale}`

          return `${GITHUB_LINK}/edit/main/docs/${docPath}`
        },
        // @ts-ignore
        remarkPlugins: [npm2yarn],
        sidebarPath: require.resolve('./sidebar.community.ts'),
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
      } satisfies ContentDocsOptions,
    ],
    [
      require.resolve('@docusaurus/plugin-ideal-image'),
      {
        quality: 70,
        max: 1030,
        min: 640,
        steps: 2,
        // Use false to debug, but it incurs huge perf costs
        disableInDev: true,
      } satisfies IdealImageOptions,
    ],
    [
      require.resolve('@docusaurus/plugin-pwa'),
      {
        debug: ENV.isDeployPreview,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
        ],
        // swRegister: false,
        swCustom: require.resolve('./src/sw.js'),
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: 'img/images/logo.png',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: 'manifest.json',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: THEME_COLOR,
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-capable',
            content: 'yes',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-status-bar-style',
            content: '#000',
          },
          {
            tagName: 'link',
            rel: 'apple-touch-icon',
            href: 'img/images/logo.png',
          },
          {
            tagName: 'link',
            rel: 'mask-icon',
            href: 'img/images/logo.png',
            color: THEME_COLOR,
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileImage',
            content: 'img/images/logo.png',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileColor',
            content: '#000',
          },
        ],
      } satisfies PwaOptions,
    ],
  ],
  presets: [
    [
      'classic',
      {
        debug: true, // force debug plugin usage
        docs: {
          // routeBasePath: '/',
          path: 'docs',
          sidebarPath: require.resolve('./sidebars.ts'),
          // sidebarCollapsible: false,
          // sidebarCollapsed: true,
          editUrl: ({ locale, docPath }) => {
            if (locale !== DEFAULT_LOCALE)
              return `https://crowdin.com/project/${PROJECT_NAME}/${locale}`

            // We want users to submit doc updates to the upstream/next version!
            // Otherwise we risk losing the update on the next release.
            return `${GITHUB_LINK}/edit/main/docs/${docPath}`
          },
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          // @ts-ignore
          remarkPlugins: [remarkMath, [npm2yarn, { sync: true }], configTabs],
          rehypePlugins: [],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies ClassicOptions,
    ],
  ],
  themeConfig: {
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    announcementBar: {
      id: 'announcementBar-2', // Increment on change
      content: `⭐️ If you like ${PROJECT_DISPLAY_NAME}, give it a star on <a target="_blank" rel="noopener noreferrer" href="${GITHUB_LINK}">GitHub</a>`,
    },
    metadata: [{
      name: 'theme-color',
      content: THEME_COLOR,
    }],
    prism: {
      theme: lightTheme,
      darkTheme,
      // additionalLanguages: ['javascript', 'html', 'css', 'typescript'],
      magicComments: [
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line',
          block: { start: 'highlight-start', end: 'highlight-end' },
        },
        {
          className: 'code-block-error-line',
          line: 'This will error',
        },
      ],
    },
    image: 'img/docusaurus-social-card.jpg',
    algolia: {
      appId: 'X1Z85QJPUV',
      apiKey: 'bf7211c161e8205da2f933a02534105a',
      indexName: PROJECT_NAME,
      replaceSearchResultPathname:
        ENV.isDev || ENV.isDeployPreview
          ? {
              from: /^\/docs\/next/g as unknown as string,
              to: '/docs',
            }
          : undefined,
    },
    navbar: {
      hideOnScroll: true,
      title: PROJECT_DISPLAY_NAME,
      logo: {
        alt: PROJECT_DISPLAY_NAME,
        src: 'img/svg/logo.svg',
        srcDark: 'img/svg/logo.svg',
        width: 32,
        height: 32,
      },
      items: [
        {
          type: 'doc',
          position: 'left',
          docId: 'introduction',
          label: 'Docs',
        },
        {
          to: 'examples',
          label: 'Examples',
          position: 'left',
        },
        {
          to: '/community/support',
          label: 'Community',
          position: 'left',
          activeBaseRegex: '/community/',
        },

        // Right
        {
          type: 'localeDropdown',
          position: 'right',
          dropdownItemsAfter: [
            {
              type: 'html',
              value: '<hr style="margin: 0.3rem 0;">',
            },
            {
              href: 'https://github.com/facebook/docusaurus/issues/3526',
              label: 'Help Us Translate',
            },
          ],
        },
        {
          'href': GITHUB_LINK,
          'position': 'right',
          'className': 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Nicepkg. Built with Docusaurus.`,
    },
  } satisfies ThemeConfig,
}

export default config
