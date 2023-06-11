import visit from 'unist-util-visit'
import type { Node, Parent } from 'unist'

interface CustomNode extends Node {
  meta?: string
  value: string
}

/**
 * Turns a "```js config-tabs" code block into a "plugin options" and a "preset
 * options" tab
 */
export default function plugin() {
  /** @type {import("unified").Transformer} */
  const transformer = (root: any) => {
    visit<CustomNode>(root, 'code', (node, index, parent) => {
      if (!node.meta?.includes('config-tabs'))
        return

      const { value } = node
      const [presetMeta = '', pluginMeta = ''] = value.split('\n')
      const {
        groups: { presetOptionName },
      } = presetMeta.match(/\/\/.*?: (?<presetOptionName>[A-Z]+)/i) as any
      ?? {
        groups: { presetOptionName: '[translation failure]' },
      }

      const {
        groups: { pluginName },
      } = pluginMeta.match(/\/\/.*?: (?<pluginName>[A-Z@/-]+)/i) as any ?? {
        groups: { pluginName: '[translation failure]' },
      }
      // Replace pragma comments
      const config = value
        .replace(presetMeta, '')
        .replace(pluginMeta, '')
        .trim()
        .replace(/^.*?= /, '')
        .replace(/;$/, '')

        .replace(/([`$\\])/g, '\\$1')

      ;(parent as Parent<CustomNode>).children.splice(
        index,
        1,
        {
          type: 'import',
          value: 'import ConfigTabs from "@site/src/components/ConfigTabs";',
        },
        {
          type: 'jsx',
          value: `<ConfigTabs
            pluginName="${pluginName.trim()}"
            presetOptionName="${presetOptionName.trim()}"
            code={\`${config}\`}
          />`,
        },
      )
    })
  }
  return transformer
}
