import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

const sidebars: SidebarsConfig = {
  Docs: [
    'introduction',
    {
      type: 'category',
      label: 'Getting Started',
      link: {
        type: 'generated-index',
      },
      collapsed: false,
      items: [
        'installation',
        'configuration',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      link: {
        type: 'generated-index',
        title: 'GPT Runner Guides',
        description:
          'Let\'s learn about the most important GPT Runner concepts!',
        keywords: ['guides'],
        image: '/img/svg/logo.svg',
      },
      items: [
        'guides/whats-next',
      ],
    },
    {
      type: 'category',
      label: 'Tools',
      link: { type: 'doc', id: 'tools/index' },
      items: [
        'tools/cli',
        'tools/web',
        'tools/vscode',
      ],
    },
  ],
}

export default sidebars
