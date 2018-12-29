const event = require('jm-event')
const consts = require('../consts')

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
      console.log(doc)
      if (doc.expire && doc.time + doc.expire * 1000 < Date.now()) {
        return consts.ERR.FA_CONFIG_EXPIRED
      } else {
        return doc
      }
    } catch (e) {
      return consts.ERR.FA_PARSE_CONFIG
    }
  }

  /**
   * 字符串化配置值
   * @method config#_stringify
   * @param {Object} [opts={}] 参数
   * @example
   * opts参数:{
   *  value: 配置值(可选, 默认null)
   *  expire: 过期时间, 单位秒, 0代表永不过期(可选, 默认0)
   * }
   * 返回结果字符串
   */
  function _stringify (opts) {
    var value = opts.value
    if (value === undefined) value = null
    var expire = opts.expire || 0
    var time = Date.now()
    var v = {
      value: value,
      time: time,
      expire: expire
    }
    return JSON.stringify(v)
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
        let _doc = _parse(doc[key])
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

  /**
   * 设置配置信息
   * @method config#setConfig
   * @param {Object} [opts={}] 参数
   * @example
   * opts参数:{
   *  root: 根(可选)
   *  key: 配置项(必填)
   *  value: 配置值(可选, 默认null)
   *  expire: 过期时间, 单位秒, 0代表永不过期(可选, 默认0)
   * }
   * 成功响应:
   * doc: 结果(true or false)
   * 错误响应:
   * doc: {
   *  err: 错误码,
   *  msg: 错误信息
   * }
   */
  async function setConfigs(opts = {}) {
    let root = opts.root || RootKey
    let value = opts.value || {}
    let v = []
    for (let key in value) {
      let o = {
        value: value[key],
        expire: opts.expire || 0
      }
      let val = _stringify(o)
      v.push(key)
      v.push(val)
    }

    let doc
    try {
      doc = await redis.hmset(root, v)
    } catch (e) {
      return consts.ERR.FA_SET_CONFIG
    }
    if (doc !== 'OK') return { ret: false }
    return { ret: true }
  }

  return {
    listConfig,
    setConfigs
  }
}
