import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/browser',
    'src/common',
    'src/node',
  ],
  clean: true,
  declaration: true,
  externals: [
    'unconfig',
    'express',
  ],
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
})
