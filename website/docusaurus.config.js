const tsconfig = require('./tsconfig.node.json')
require('ts-node').register(tsconfig)
const { default: config } = require('./docusaurus.config.ts')

module.exports = config
