/**
 * config服务
 * @class config
 * @param {Object} [opts={}] 参数
 * @example
 * opts参数:{
 *  mq: (可选, 如果不填，自动连接默认mq redis://127.0.0.1:6379)
 * }
 * @returns {Object}
 * @example
 * 返回结果:{
 *  mq: mq服务
 * }
 */
var jm = require('jm-core')
if (!jm.config) {
  jm.config = function (opts) {
    opts = opts || {};
    ['mq'].forEach(function (key) {
      process.env[key] && (opts[key] = process.env[key])
    })
    var o = require('./service')(opts)
    o.router = require('./router')
    return o
  }
}
module.exports = jm.config
