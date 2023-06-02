import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    {
      builder: 'rollup',
      input: 'src/index',
      name: 'index',
    },
    {
      builder: 'rollup',
      input: 'src/cli',
      name: 'cli',
    },
  ],
  clean: true,
  declaration: true,
  rollup: {
    inlineDependencies: true,
  },
})
