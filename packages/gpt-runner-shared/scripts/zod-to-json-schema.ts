import { aiPersonJsonSchema, globalAiPersonConfigJsonSchema } from '../src/common'
import { FileUtils, PathUtils } from '../src/node'

interface JsonSchemaFile {
  fileName: string
  content: string
}
async function generateJsonSchemaFile() {
  const jsonSchemaFiles: JsonSchemaFile[] = [
    {
      fileName: 'user-config.json',
      content: JSON.stringify(globalAiPersonConfigJsonSchema, null, 2),
    },
    {
      fileName: 'single-file-config.json',
      content: JSON.stringify(aiPersonJsonSchema, null, 2),
    },
  ]

  for (const { fileName, content } of jsonSchemaFiles) {
    try {
      await FileUtils.writeFile({
        filePath: PathUtils.resolve(__dirname, `../dist/json-schema/${fileName}`),
        content,
        valid: false,
      })

      console.log(`${fileName} written successfully`)
    }
    catch (e) {
      console.error(`${fileName} could not be written: ${e}`)
    }
  }
}

generateJsonSchemaFile().then(() => {
  console.log('generateJsonSchemaFile done')
}).catch((e) => {
  console.error('generateJsonSchemaFile error:', e)
})
