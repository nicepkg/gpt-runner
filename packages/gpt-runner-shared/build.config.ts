import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    {
      builder: 'rollup',
      input: 'src/browser/index',
      name: 'browser',
    },
    {
      builder: 'rollup',
      input: 'src/common/index',
      name: 'common',
    },
    {
      builder: 'rollup',
      input: 'src/node/index',
      name: 'node',
    },
  ],
  clean: true,
  declaration: true,
  externals: [
    'unconfig',
    'express',
    'debug',
    'minimatch',
  ],
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
})
