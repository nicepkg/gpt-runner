const tsconfig = require('./tsconfig.node.json')
require('ts-node').register(tsconfig)
const { default: config } = require('./sidebars.ts')

module.exports = config
