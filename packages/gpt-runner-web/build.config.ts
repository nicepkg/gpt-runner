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
    'langchain',
  ],
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
})
