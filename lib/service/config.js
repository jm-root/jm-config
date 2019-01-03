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
      if (doc.expire && doc.time + doc.expire * 1000 < Date.now()) {
        return consts.ERR.FA_CONFIG_EXPIRED
      }
      return doc
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
    let value = opts.value
    if (value === undefined) { value = null }
    let expire = opts.expire || 0
    let time = Date.now()
    let v = {
      value: value,
      time: time,
      expire: expire
    }
    return JSON.stringify(v)
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
  async function setConfig (opts) {
    let root = opts.root || consts.RootKey
    if (!opts.key) { return consts.ERR.FA_PARAMS }

    try {
      let doc = await redis.hset(root, opts.key, _stringify(opts))
      if (doc !== 1 && doc !== 0) return { ret: false }
      return { ret: true }
    } catch (e) {
      return consts.ERR.FA_SET_CONFIG
    }
  }

  /**
   * 获取配置信息
   * @method config#getConfig
   * @param {Object} [opts={}] 参数
   * @example
   * opts参数:{
   *  root: 根(可选)
   *  key: 配置项(必填)
   * }
   * 成功响应:
   * doc: 配置值(基本类型, 对象或者数组)
   * 错误响应:
   * doc: {
   *  err: 错误码,
   *  msg: 错误信息
   * }
   */
  async function getConfig(opts = {}) {
    let root = opts.root || consts.RootKey
    if (!opts.key) {
      return consts.ERR.FA_PARAMS
    }
    let doc
    try {
      doc = await redis.hget(root, opts.key)
    } catch (e) {
      return consts.ERR.FA_GET_CONFIG
    }
    if (!doc) return { ret: null }
    doc = _parse(doc)
    if (doc === consts.ERR.FA_CONFIG_EXPIRED) {
      await delConfig(opts)
      return doc
    } else if (doc === consts.ERR.FA_PARSE_CONFIG) {
      return doc
    }
    return { ret: doc.value }
  }

  /**
   * 删除配置信息
   * @method config#delConfig
   * @param {Object} [opts={}] 参数
   * @example
   * opts参数:{
   *  root: 根(可选)
   *  key: 配置项(必填)
   *  all: 是否全部删除(可选)
   * }
   * 成功响应:
   * doc: 结果(true or false)
   * 错误响应:
   * doc: {
   *  err: 错误码,
   *  msg: 错误信息
   * }
   */
  async function delConfig (opts = {}) {
    let root = opts.root || consts.RootKey
    let key = opts.key
    if (opts.all) { return await delRoot(opts) }
    if (!key) {
      return consts.ERR.FA_PARAMS
    }
    try {
      let doc = await redis.hdel(root, key)
      if (!doc) return { ret: false }
      return { ret: true }
    } catch (e) {
      return consts.ERR.FA_DEL_CONFIG
    }

  }

  /**
   * 删除根配置, 所有根下面的配置信息都被删除
   * @method config#delRoot
   * @param {Object} [opts={}] 参数
   * @example
   * opts参数:{
   *  root: 根(可选)
   * }
   * 成功响应:
   * doc: 结果(true or false)
   * 错误响应:
   * doc: {
   *  err: 错误码,
   *  msg: 错误信息
   * }
   */
  async function delRoot(opts = {}) {
    let root = opts.root || consts.RootKey
    try {
      let doc = await redis.del(root)
      if (!doc) return { ret: false }
      return { ret: true }
    } catch (e) {
      return consts.ERR.FA_DEL_CONFIG
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
    let root = opts.root || consts.RootKey
    let doc
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
      return doc
    } else {
      doc = await redis.hkeys(root)
      if (!doc) return doc = []
      return { rows: doc }
    }
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
    let root = opts.root || consts.RootKey
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
    try {
      let doc = await redis.hmset(root, v)
      if (doc !== 'OK') return { ret: false }
      return { ret: true }
    } catch (e) {
      return consts.ERR.FA_SET_CONFIG
    }
  }

  return {
    listConfig,
    getConfig,
    setConfigs,
    setConfig,
    delConfig,
    delRoot
  }
}
