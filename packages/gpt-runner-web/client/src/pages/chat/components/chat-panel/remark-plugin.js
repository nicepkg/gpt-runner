import { visit } from 'unist-util-visit'
import { openEditor } from '../../../../networks/editor'

function cleanPath(path) {
  return path.replace(/(^\.\/)|(^\/)/g, '')
}

function isMatchPath(value, matchPath, sourcePath) {
  const returns = {
    isMatch: false,
    matchContentStartIndex: -1,
    matchContentEndIndex: -1,
    beforeMatchContent: '',
    linkContent: '',
    afterMatchContent: '',
    jumpPath: '',
  }
  const path = cleanPath(matchPath)

  const matchStartIndex = value.indexOf(path)

  if (matchStartIndex !== -1) {
    Object.assign(returns, {
      isMatch: true,
      matchContentStartIndex: matchStartIndex,
      matchContentEndIndex: matchStartIndex + path.length,
      beforeMatchContent: `${value.substring(0, matchStartIndex)}  `,
      linkContent: path,
      afterMatchContent: `  ${value.substring(matchStartIndex + path.length)}`,
      jumpPath: sourcePath,
    })

    return returns
  }
  return returns
}

/**
 *
 * @param {{source: string, matchPath: string}[]} matchPathInfos
 * @returns
 */
export function createRemarkOpenEditorPlugin(matchPathInfos = []) {
  return function () {
    const transformer = (tree) => {
      visit(tree, ['text', 'inlineCode'], (node, index, parent) => {
        const { value } = node

        if (node.processed)
          return
        node.processed = true

        let isMatch = false
        let isMatchPathResult = null

        matchPathInfos.forEach((pathInfo) => {
          if (isMatch)
            return

          isMatchPathResult = isMatchPath(value, pathInfo.matchPath, pathInfo.source)

          if (!isMatchPathResult.isMatch)
            return

          isMatch = true
        })

        if (!isMatch || !isMatchPathResult)
          return

        const {
          beforeMatchContent,
          linkContent,
          afterMatchContent,
          jumpPath,
        } = isMatchPathResult

        const nodes = []

        if (beforeMatchContent !== '') {
          nodes.push({
            type: 'text',
            value: beforeMatchContent,
            processed: true,
          })
        }

        // Create <a> element with onClick event
        const linkNode = {
          type: 'link',
          url: '#',
          title: linkContent,
          processed: true,
          children: [
            {
              type: 'text',
              value: linkContent,
              processed: true,
            },
          ],
          data: {
            hProperties: {
              onClick: (e) => {
                e.preventDefault()
                e.stopPropagation()

                // Execute openEditor event
                openEditor({
                  path: jumpPath,
                })
              },
            },
          },
        }

        nodes.push(linkNode)

        if (afterMatchContent !== '') {
          nodes.push({
            type: 'text',
            value: afterMatchContent,
          })
        }

        parent.children.splice(index, 1, ...nodes)
      })
    }
    return transformer
  }
}
