import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    {
      builder: 'rollup',
      input: 'src/index',
      name: 'index',
    },
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
