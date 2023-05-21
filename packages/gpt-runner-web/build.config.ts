import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'index',
    'server/src/index',
  ],
  clean: true,
  declaration: true,
  externals: [
    'unconfig',
  ],
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
})
