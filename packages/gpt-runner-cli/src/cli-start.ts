import { cac } from 'cac'
import { loadUserConfig } from '@nicepkg/gpt-runner-core'
import { PathUtils, getLocalHostname, getPort, openInBrowser } from '@nicepkg/gpt-runner-shared/node'
import { consola } from 'consola'
import { cyan, green } from 'colorette'
import { execa } from 'execa'
import waitPort from 'wait-port'
import { Debug } from '@nicepkg/gpt-runner-shared/common'
import { version } from '../package.json'
import type { CliOptions } from './types'

const __dirname = PathUtils.getCurrentDirName(import.meta.url)
const startServerJsPath = PathUtils.resolve(__dirname, '../node_modules/@nicepkg/gpt-runner-web/dist/start-server.mjs')

export async function startCli(cwd = PathUtils.resolve(process.cwd()), argv = process.argv, options: CliOptions = {}) {
  const cli = cac('gptr')

  cli
    .command('[...rootPaths]', 'root path', {
      ignoreOptionDefaultValue: true,
    })
    .option('-p, --port [port number]', 'Server port', {
      default: 3003,
    })
    .option('-c, --config [file]', 'Config file path')
    .option('-w, --watch', 'Watch for file changes')
    .option('--no-open', 'Open in browser')
    .option('--debug', 'Debug mode')
    .action(async (rootPaths: Array<string>, flags) => {
      Object.assign(options, {
        cwd,
        ...flags,
        rootPath: rootPaths?.[0] || options.rootPath,
      })

      if (options.debug)
        process.env.DEBUG = 'enabled'

      const debug = new Debug('gpt-runner-cli')
      debug.log('parse cli options', options)

      const { config } = await loadUserConfig(options.rootPath || options.cwd, options.config)

      // TODO: add support for config file and watching
      debug.log('parse user config', config)

      const finalPort = await getPort({
        defaultPort: options.port ?? 3003,
        autoFreePort: true,
      })

      const startServerProcessPromise = execa('node', [startServerJsPath, '--port', String(finalPort)], {
        env: {
          ...process.env,
          NODE_OPTIONS: '--experimental-fetch',
          NODE_NO_WARNINGS: '1',
        },
      })

      startServerProcessPromise.on('error', (error) => {
        consola.error(error)
      })

      const afterServerStartSuccess = () => {
        const getUrl = (isLocalIp = false) => {
          const localIp = getLocalHostname()
          return `http://${isLocalIp ? localIp : 'localhost'}:${finalPort}/#/chat?rootPath=${config.rootPath?.replace(/\\/g, '/')}`
        }

        consola.success(`\n\n${green(`GPT-Runner web is at:\n\n${cyan(getUrl())}\n\n${cyan(getUrl(true))}\n`)}`)

        if (options.open ?? true) {
          openInBrowser({
            url: getUrl(),
          })
        }
      }

      waitPort({
        port: finalPort,
        output: 'silent',
      }).then(afterServerStartSuccess).catch(consola.error)

      await startServerProcessPromise
    })

  cli.help()
  cli.version(version)

  // Parse CLI args without running the command to
  // handle command errors globally
  cli.parse(argv, { run: false })
  await cli.runMatchedCommand()
}
