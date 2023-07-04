/* eslint-disable no-template-curly-in-string */
import * as vscode from 'vscode'
import type { ExtensionContext } from 'vscode'
import { FileUtils } from '@nicepkg/gpt-runner-shared/node'
import type { ContextLoader } from '../contextLoader'
import { GPT_MD_COMPLETION_ITEM_SNIPPET } from '../constant'

// Helper function to create completion items from JSON schema properties
function createCompletionItemsFromSchema(
  schema: any,
  parentProperty: string | null = null,
): vscode.CompletionItem[] {
  const completionItems: vscode.CompletionItem[] = []

  if (schema.properties) {
    for (const propName in schema.properties) {
      const propertySchema = schema.properties[propName]
      const itemLabel = parentProperty ? `${parentProperty}.${propName}` : propName
      const completionItem = new vscode.CompletionItem(
        `"${itemLabel}"`,
        vscode.CompletionItemKind.Property,
      )

      const valueTypeInsertWrapperMap: Record<string, string> = {
        string: '"${1}"',
        number: '${1}',
        boolean: '${1:true}',
        array: '[${1}]',
        object: '{${1}}',
      }

      completionItem.insertText = new vscode.SnippetString(
        `${propName}": ${valueTypeInsertWrapperMap[propertySchema.type] || '${1}'}`,
      )

      completionItem.documentation = new vscode.MarkdownString(
        propertySchema.description || '',
      )
      completionItems.push(completionItem)

      if (propertySchema.type === 'object') {
        const childCompletionItems = createCompletionItemsFromSchema(
          propertySchema,
          itemLabel,
        )
        completionItems.push(...childCompletionItems)
      }
    }
  }

  return completionItems
}

export async function registerCompletion(
  cwd: string,
  contextLoader: ContextLoader,
  ext: ExtensionContext,
) {
  const disposables: vscode.Disposable[] = []

  const dispose = () => {
    disposables.forEach(d => d.dispose())
  }

  const registerProvider = () => {
    dispose()

    const disposable = vscode.languages.registerCompletionItemProvider(
      { scheme: 'file', pattern: '**/*.gpt.md' },
      {
        async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
          const completions: vscode.CompletionItem[] = []
          const tips = 'Quick Init GPT File'

          const snippetCompletion = new vscode.CompletionItem('gptr')
          snippetCompletion.insertText = new vscode.SnippetString(GPT_MD_COMPLETION_ITEM_SNIPPET)
          snippetCompletion.documentation = new vscode.MarkdownString(tips)
          completions.push(snippetCompletion)

          const linePrefix = document.lineAt(position).text.substring(0, position.character)
          if (position.line === 0 && linePrefix.includes('```j')) {
            const completionItem = new vscode.CompletionItem('json', vscode.CompletionItemKind.Snippet)
            completionItem.insertText = new vscode.SnippetString(GPT_MD_COMPLETION_ITEM_SNIPPET.replace(/^\`\`\`/, ''))
            completionItem.documentation = new vscode.MarkdownString(tips)
            completions.push(completionItem)
          }

          // json schema
          const { extensionUri } = ext
          const jsonSchemaPath = vscode.Uri.joinPath(extensionUri, './dist/json-schema/single-file-config.json').fsPath
          const jsonSchemaContent = await FileUtils.readFile({ filePath: jsonSchemaPath })
          const jsonSchema = JSON.parse(jsonSchemaContent)

          // add suggestions for properties by json schema
          const schemaCompletionItems = createCompletionItemsFromSchema(jsonSchema)
          completions.push(...schemaCompletionItems)

          return completions
        },
      })

    disposables.push(disposable)

    return disposable
  }

  ext.subscriptions.push(
    registerProvider(),
  )

  contextLoader.emitter.on('contextReload', () => {
    registerProvider()
  })
  contextLoader.emitter.on('contextUnload', () => {
    dispose()
  })
}
