/**
 * config服务
 * @class config
 * @param {Object} [opts={}] 参数
 * @example
 * opts参数:{
 *  redis: (可选, 如果不填，自动连接默认 redis://127.0.0.1:6379)
 * }
 * @returns {Object}
 * @example
 * 返回结果:{
 *  redis: redis服务
 * }
 */
const Service = require('./service')

module.exports = function (opts = {}) {
  const app = this || {}
  return new Service({ app, ...opts })
}
