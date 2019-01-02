module.exports = {
  port: 80,
  redis: 'redis://redis.db',
  modules: {
    config: {
      module: process.cwd() + '/lib'
    },
  }
}
