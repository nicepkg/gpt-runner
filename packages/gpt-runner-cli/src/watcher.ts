import type { FSWatcher } from 'chokidar'
import type { CliOptions } from './types'

// TODO: move into core
let watcher: FSWatcher

export async function getWatcher(options?: CliOptions) {
  // test case entry without options
  if (watcher && !options)
    return watcher

  const { watch } = await import('chokidar')
  const ignored = ['**/{.git,node_modules}/**']
  // cli may create multiple watchers
  const newWatcher = watch([] as string[], {
    ignoreInitial: true,
    ignorePermissionErrors: true,
    ignored,
    cwd: options?.cwd || process.cwd(),
  })
  watcher = newWatcher
  return newWatcher
}
