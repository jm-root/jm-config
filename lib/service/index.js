const event = require('jm-event')
const Redis = require('ioredis')
const Config = require('./config')

class Service {
  constructor (opts = {}) {
    let self = this
    event.enableEvent(this)
    this.redis = new Redis(opts.redis || {})
    this.config = new Config(self)
    self.ready = true
    self.emit('ready')
  }

  onReady () {
    let self = this
    return new Promise(function (resolve, reject) {
      if (self.ready) return resolve(self.ready)
      self.on('ready', function () {
        resolve()
      })
    })
  }
}
module.exports = Service
