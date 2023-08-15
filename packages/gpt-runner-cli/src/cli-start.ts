import { cac } from 'cac'
import { loadUserConfig } from '@nicepkg/gpt-runner-core'
import { PathUtils, Tunnel, checkNodeVersion, getLocalHostname, getPort, getRunServerEnv, openInBrowser } from '@nicepkg/gpt-runner-shared/node'
import { consola } from 'consola'
import { cyan, green } from 'colorette'
import execa from 'execa'
import waitPort from 'wait-port'
import { Debug } from '@nicepkg/gpt-runner-shared/common'
import { version } from '../package.json'
import type { CliOptions } from './types'

const dirname = PathUtils.getCurrentDirName(import.meta.url, () => __dirname)
const startServerJsPath = PathUtils.resolve(dirname, '../node_modules/@nicepkg/gpt-runner-web/dist/start-server.cjs')

export async function startCli(cwd = PathUtils.resolve(process.cwd()), argv = process.argv, options: CliOptions = {}) {
  const cli = cac('gptr')

  cli
    .command('[rootPath]', 'root path', {
      ignoreOptionDefaultValue: true,
    })
    .option('-p, --port [port number]', 'Server port', {
      default: 3003,
    })
    .option('-c, --config [file]', 'Config file path')
    // .option('-w, --watch', 'Watch for file changes')
    .option('--share', 'Share the link to temp link')
    .option('--no-open', 'Open in browser')
    .option('--debug', 'Debug mode')
    .action(async (_, flags) => {
      Object.assign(options, {
        cwd,
        ...flags,
        rootPath: options.rootPath ? PathUtils.resolve(process.cwd(), options.rootPath) : '',
      })

      if (options.debug)
        process.env.DEBUG = 'enabled'

      const debug = new Debug('gpt-runner-cli')
      debug.log('parse cli options', options)

      const nodeValidMsg = checkNodeVersion()
      if (nodeValidMsg) {
        consola.error(nodeValidMsg)
        process.exit(1)
      }

      const { config } = await loadUserConfig(options.rootPath || options.cwd, options.config)

      // TODO: add support for config file and watching
      debug.log('parse user config', config)

      const finalPort = await getPort({
        defaultPort: options.port ?? 3003,
        autoFreePort: true,
      })

      let startServerPromise: Promise<any> | undefined

      try {
        startServerPromise = execa('node', [startServerJsPath, '--port', String(finalPort)], {
          env: {
            ...process.env,
            ...getRunServerEnv(),
            GPTR_ONLY_LOAD_CONFIG_PATH: options.config || '',
          },
          stdio: 'inherit',
        }).on('message', (message) => {
          consola.info(message)
        }).on('error', (error) => {
          consola.error(error)
        })
      }
      catch (error) {
        consola.error(error)
      }

      const afterServerStartSuccess = async () => {
        const getUrl = (isLocalIp = false) => {
          const localIp = getLocalHostname()
          return `http://${isLocalIp ? localIp : 'localhost'}:${finalPort}`
        }

        consola.success(`\n\n${green(`GPT-Runner web local is at:\n\n${cyan(getUrl())}\n\n${cyan(getUrl(true))}\n`)}`)

        try {
          if (options.share ?? false) {
            consola.info(`\n\n${green('Sharing GPT-Runner web...')}`)

            const tunnel = new Tunnel({
              localPort: finalPort,
            })

            const sharedUrl = await tunnel.startTunnel()

            if (sharedUrl)
              consola.success(`\n\n${green(`GPT-Runner web is shared at:\n\n${cyan(sharedUrl)}`)}`)
          }
        }
        catch (error) {
          consola.error(error)
        }

        if (options.open ?? true) {
          openInBrowser({
            url: getUrl(),
          })
        }
      }

      try {
        await waitPort({
          port: finalPort,
          output: 'silent',
        })

        afterServerStartSuccess()

        await startServerPromise
      }
      catch (error) {
        consola.error(error)
      }
    })

  cli.help()
  cli.version(version)

  // Parse CLI args without running the command to
  // handle command errors globally
  cli.parse(argv, { run: false })
  await cli.runMatchedCommand()
}
