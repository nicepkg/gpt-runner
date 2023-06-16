import { zodToJsonSchema } from 'zod-to-json-schema'
import { SingleFileConfigSchema, UserConfigSchema } from '../src/common'
import { FileUtils, PathUtils } from '../src/node'

const userConfigJsonSchema = zodToJsonSchema(UserConfigSchema)
const singleFileJsonSchema = zodToJsonSchema(SingleFileConfigSchema)

interface JsonSchemaFile {
  fileName: string
  content: string
}
async function generateJsonSchemaFile() {
  const jsonSchemaFiles: JsonSchemaFile[] = [
    {
      fileName: 'user-config.json',
      content: JSON.stringify(userConfigJsonSchema, null, 2),
    },
    {
      fileName: 'single-file-config.json',
      content: JSON.stringify(singleFileJsonSchema, null, 2),
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
