const event = require('jm-event')
const consts = require('../consts')
const Err = consts.Err

module.exports = function (service) {
  const redis = service.redis

  /**
   * 解析配置值
   * @method config#_parse
   * @param {String} doc 被解析的字符串
   * 成功响应:
   * doc: 结果{value: 值}
   * 错误响应:
   * doc: {
   *  err: 错误码,
   *  msg: 错误信息
   * }
   */
  function _parse (doc) {
    try {
      doc = JSON.parse(doc)
      if (doc.expire && doc.time + doc.expire * 1000 < Date.now()) {
        return ERR.FA_CONFIG_EXPIRED
      } else {
        return doc
      }
    } catch (e) {
      return ERR.FA_PARSE_CONFIG
    }
  }

  /**
   * 列出所有配置项
   * @method config#listConfig
   * @param {Object} [opts={}] 参数
   * @example
   * opts参数:{
   *  root: 根(可选)
   *  all: 是否包含值(可选)
   * }
   * 成功响应:
   * doc: 结果数组或者对象(all=true时)
   * 错误响应:
   * doc: {
   *  err: 错误码,
   *  msg: 错误信息
   * }
   */
  async function listConfig (opts = {}) {
    let doc
    var root = opts.root || consts.RootKey
    if (opts.all) {
      doc = await redis.hgetall(root)
      if (!doc) return {}
      for (let key in doc) {
        var _doc = _parse(doc[key])
        if (_doc.value) {
          doc[key] = _doc.value
        } else {
          delete doc[key]
        }
      }
    } else {
      doc = await redis.hkeys(root)
      if (!doc) return []
    }
    return doc
  }

  async function setConfigs(opts = {}) {

  }

  return {
    listConfig,
    setConfigs
  }
}
