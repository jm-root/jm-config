const Redis = require('ioredis')
const Config = require('./config')
const { Service } = require('jm-server')

module.exports = class extends Service {
  constructor (opts = {}) {
    super(opts)
    this.redis = new Redis(opts.redis || {})
    this.config = new Config(this)
    this.emit('ready')
  }

  router (opts) {
    const dir = `${__dirname}/../router`
    return this.loadRouter(dir, opts)
  }
}
