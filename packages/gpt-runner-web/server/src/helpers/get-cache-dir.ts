import fs from 'node:fs'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
// @ts-ignore
import getCacheDir from 'cachedir'
import { PathUtils } from '@nicepkg/gpt-runner-shared/node'

export async function getGlobalCacheDir(name: string) {
  const cacheDir = getCacheDir(name)
  await createCacheDir(cacheDir)
  return cacheDir
}

async function createCacheDir(cacheDir: string) {
  if (await PathUtils.isAccessible(cacheDir, 'W'))
    return

  await fs.promises.mkdir(cacheDir, { recursive: true })
}
