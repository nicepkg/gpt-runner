import { FileUtils, PathUtils } from '@nicepkg/gpt-runner-shared/node'
import { appConfig } from '../server/index'

async function buildAppConfigJson() {
  try {
    await FileUtils.writeFile({
      filePath: PathUtils.resolve(__dirname, '../assets/app-config.json'),
      content: JSON.stringify(appConfig, null, 2),
      valid: false,
    })

    console.log('buildAppConfigJson successfully')
  }
  catch (e) {
    console.error(`buildAppConfigJson fail, could not be written: ${e}`)
  }
}

buildAppConfigJson().then(() => {
  console.log('buildAppConfigJson done')
}).catch((e) => {
  console.error('buildAppConfigJson error:', e)
})
