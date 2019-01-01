require('log4js').configure(require('path').join(__dirname, 'log4js.json'))
var config = {
  development: {
    port: 20000,
    mqtt: 'mqtt://root:123@api.h5.jamma.cn',
    modules: {
      config: {
        module: process.cwd() + '/lib'
      },
    }
  },
  production: {
    port: 80,
    mq: 'redis://redis.db',
    modules: {
      config: {
        module: process.cwd() + '/lib'
      }
    }
  }
}

var env = process.env.NODE_ENV || 'development'
config = config[env] || config['development']
config.env = env

module.exports = config
