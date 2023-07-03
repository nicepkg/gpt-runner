import { defineBuildConfig } from 'unbuild'

function createGetChunkFilename(ctx: any) {
  return function (chunk: any, ext: string) {
    if (chunk.isDynamicEntry)
      return `chunks/[name].${ext}`

    // TODO: Find a way to generate human friendly hash for short groups
    return `${ctx.options.name}.[hash].${ext}`
  }
}

export default defineBuildConfig({
  entries: [
    {
      builder: 'rollup',
      input: 'server/index',
      name: 'server',
    },
    {
      builder: 'rollup',
      input: 'server/start-server',
      name: 'start-server',
    },
    {
      builder: 'rollup',
      input: 'common/index',
      name: 'common',
    },
  ],
  clean: true,
  failOnWarn: false,
  // declaration: true,
  rollup: {
    emitCJS: true,
    resolve: {
      exportConditions: ['node'],
    },
    commonjs: {},
    inlineDependencies: true,
  },
  hooks: {
    'rollup:options': function (ctx, rollupOptions) {
      if (!rollupOptions.output)
        return

      if (!Array.isArray(rollupOptions.output))
        rollupOptions.output = [rollupOptions.output]

      const getChunkFilename = createGetChunkFilename(ctx)
      rollupOptions.output.forEach((output) => {
        const format = output.format || 'cjs'
        const ext = format === 'esm' ? 'mjs' : format
        output.chunkFileNames = chunk => getChunkFilename(chunk, ext)

        if (format === 'esm') {
          output.banner = `
import $__url__$ from 'url'
import $__path__$ from 'path'
const __filename = $__url__$.fileURLToPath(import.meta.url);
const __dirname = $__path__$.dirname(__filename);
${output.banner || ''}
          `
        }
      })

      // remove esm
      rollupOptions.output = rollupOptions.output.filter(output => output.format !== 'esm')
    },
  },
})
