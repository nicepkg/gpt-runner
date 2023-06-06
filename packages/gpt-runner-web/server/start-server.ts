import { program } from 'commander'
import pkg from '../package.json'
import type { StartServerProps } from './index'
import { startServer } from './index'

program.option('-p, --port <port>', 'Port number', parseInt)
program.option('--auto-free-port', 'Automatically find a free port')
program.option('--auto-open', 'Automatically open the browser')
program.option('-v, --version', 'Version number')
program.parse(process.argv)

interface ProgramOpts {
  port?: StartServerProps['port']
  autoFreePort?: boolean
  autoOpen?: boolean
  version?: boolean
}

const opts = program.opts<ProgramOpts>()

if (opts.version) {
  console.log(pkg.version)
  process.exit(0)
}
else {
  startServer(opts)
}

export const version = pkg.version
