const MS = require('jm-ms-core')
const ms = new MS()
var consts = require('../consts')
var ERR = consts.ERR

/**
 * @apiDefine Error
 *
 * @apiSuccess (Error 200) {Number} err 错误代码
 * @apiSuccess (Error 200) {String} msg 错误信息
 *
 * @apiExample {json} 错误:
 *     {
 *       err: 错误代码
 *       msg: 错误信息
 *     }
 */
module.exports = function (service, opts) {
  opts = opts || {}
  service.routes || (service.routes = {})
  const config = service.config
  const routes = service.routes

  routes.validator = function (opts, cb, next) {
    opts.data.key = opts.params.key || null
    opts.data.root = opts.params.root || null
    if (!opts.data.key) {
      return cb(new Error(ERR.FA_PARAMS.msg), ERR.FA_PARAMS)
    }
  }

  /**
     * @apiGroup config
     * @apiVersion 0.0.1
     * @apiUse Error
     *
     * @api {post} /:root/:key 设置配置信息
     * @apiName setConfig
     *
     * @apiParam {Object} [value] 配置值
     * @apiParam {Number} [expire=0] 过期时间, 单位秒, 0表示永不过期
     * @apiParam {Boolean} [json=false] value是否json字符串
     *
     * @apiSuccess {Boolean} ret 返回结果
     * @apiExample {json} 成功:
     *     {
     *       ret: true
     *     }
     * @apiExample {json} 失败:
     *     {
     *       ret: false
     *     }
     */
  routes.setConfig = function (opts, cb) {
    var data = opts.data
    if (data.json) {
      try {
        data.value = JSON.parse(data.value)
      } catch (e) {
        return cb(new Error(ERR.config.FA_PARSE_CONFIG.msg), ERR.config.FA_PARSE_CONFIG)
      }
    }
    config.setConfig(data, function (err, doc) {
      if (!err) doc = {ret: doc}
      cb(err, doc)
    })
  }

  /**
     * @apiGroup config
     * @apiVersion 0.0.1
     * @apiUse Error
     *
     * @api {get} /:root/:key 获取配置信息
     * @apiName getConfig
     *
     * @apiSuccess {Boolean} ret 返回结果
     * @apiExample {json} 成功:
     *     {
     *       ret: 配置值
     *     }
     */
  routes.getConfig = function (opts, cb) {
    config.getConfig(opts.data, function (err, doc) {
      if (!err) doc = {ret: doc}
      cb(err, doc)
    })
  }

  /**
     * @apiGroup config
     * @apiVersion 0.0.1
     * @apiUse Error
     *
     * @api {delete} /:root/:key 删除配置信息
     * @apiName delConfig
     *
     * @apiSuccess {Boolean} ret 返回结果
     * @apiExample {json} 成功:
     *     {
     *       ret: true
     *     }
     * @apiExample {json} 失败:
     *     {
     *       ret: false
     *     }
     */
  routes.delConfig = function (opts, cb) {
    config.delConfig(opts.data, function (err, doc) {
      if (!err) doc = {ret: doc}
      cb(err, doc)
    })
  }

  /**
     * @apiGroup config
     * @apiVersion 0.0.1
     * @apiUse Error
     *
     * @api {get} /:root?all= 列出所有配置项
     * @apiName listConfig
     *
     * @apiSuccess {String[]} rows 返回结果
     * @apiExample {json} 成功:
     *     {
     *       rows: 配置项数组
     *     }
     *     或者 ?all=1时全部值
     *     {
     *     }
     */
  async function listConfig(opts) {
    opts.data.root = opts.params.root || null
    return await config.listConfig(opts.data)
  }

  /**
     * @apiGroup config
     * @apiVersion 0.0.1
     * @apiUse Error
     *
     * @api {post} /:root 设置多个配置项
     * @apiName setConfigs
     *
     * @apiSuccess {Boolean} ret 返回结果
     * @apiExample {json} 成功:
     *     {
     *       ret: true
     *     }
     * @apiExample {json} 失败:
     *     {
     *       ret: false
     *     }
     */
  async function setConfigs(opts) {
    opts.data.root = opts.params.root || null
    let data = opts.data
    console.log(data)
    console.log(typeof data)
    console.log(typeof data.value)


    if (data.json) {
      try {
        data.value = JSON.parse(data.value)
      } catch (e) {
        return ERR.FA_PARSE_CONFIG
      }
    }
    return await config.setConfigs(data)
  }

  /**
     * @apiGroup config
     * @apiVersion 0.0.1
     * @apiUse Error
     *
     * @api {post} /:root 删除根配置, 所有根下面的配置信息都被删除
     * @apiName delRoot
     *
     * @apiSuccess {Boolean} ret 返回结果
     * @apiExample {json} 成功:
     *     {
     *       ret: true
     *     }
     * @apiExample {json} 失败:
     *     {
     *       ret: false
     *     }
     */
  routes.delRoot = function (opts, cb) {
    opts.data.root = opts.params.root || null
    var data = opts.data
    config.delRoot(data, function (err, doc) {
      if (!err) doc = {ret: doc}
      cb(err, doc)
    })
  }

  var _validator = function (opts, cb, next) { routes.validator(opts, cb, next) }
  var _setConfig = function (opts, cb, next) { routes.setConfig(opts, cb, next) }
  var _getConfig = function (opts, cb, next) { routes.getConfig(opts, cb, next) }
  var _delConfig = function (opts, cb, next) { routes.delConfig(opts, cb, next) }
  var _delRoot = function (opts, cb, next) { routes.delRoot(opts, cb, next) }

  const router = ms.router()
  router
    .use(function (opts) {
      opts.data = opts.data || {}
    })
    .add('/:root/:key', 'get', [_validator, _getConfig])
    .add('/:root/:key', 'post', [_validator, _setConfig])
    .add('/:root/:key', 'delete', [_validator, _delConfig])
    .add('/:root', 'get', listConfig)
    .add('/:root', 'post', setConfigs)
    .add('/:root', 'delete', _delRoot)

  return router
}
