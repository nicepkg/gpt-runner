import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    {
      builder: 'rollup',
      input: 'server/index',
      name: 'server',
    }, {
      builder: 'rollup',
      input: 'common/index',
      name: 'common',
    },
  ],
  clean: true,
  declaration: true,
  externals: [
    'unconfig',
    'langchain',
  ],
  rollup: {
    emitCJS: true,
    // inlineDependencies: true,
  },
})
