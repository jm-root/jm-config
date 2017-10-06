require('log4js').configure(require('./log4js'))
var config = {
  development: {
    port: 20000,
    mqtt: 'mqtt://root:123@api.h5.jamma.cn',
    modules: {
      config: {
        module: process.cwd() + '/lib'
      },
      'jm-config-mqtt': {},
      'jm-config-mq': {}
    }
  },
  production: {
    port: 20000,
    mq: 'redis://redis.db',
    modules: {
      config: {
        module: process.cwd() + '/lib'
      },
      'jm-config-mqtt': {},
      'jm-config-mq': {}
    }
  }
}

var env = process.env.NODE_ENV || 'development'
config = config[env] || config['development']
config.env = env

if (process.env['disableMQTT']) delete config.modules['jm-config-mqtt']
if (process.env['disableMQ']) delete config.modules['jm-config-mq']

module.exports = config
