module.exports = {
  appenders: {
    console: { type: 'console' },
    config: {
      type: 'dateFile',
      filename: 'logs/config',
      pattern: 'yyyyMMdd.log',
      alwaysIncludePattern: true
    }
  },
  categories: {
    default: { appenders: [ 'console' ], level: 'info' },
    config: { appenders: [ 'console', 'config' ], level: 'info' }
  }
}
