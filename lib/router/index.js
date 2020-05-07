const { ms } = require('jm-server')
const consts = require('../consts')

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
module.exports = function (service) {
  const config = service.config

  async function validator (opts) {
    opts.data.key = opts.params.key || null
    opts.data.root = opts.params.root || null
    if (!opts.data.key) {
      return consts.ERR.FA_PARAMS
    }
  }

  /**
     * @apiGroup config
     * @apiVersion 2.0.0
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
  async function setConfig (opts) {
    let data = opts.data || {}
    if (data.json) {
      try {
        data.value = JSON.parse(data.value)
      } catch (e) {
        return consts.ERR.FA_PARSE_CONFIG
      }
    }
    return config.setConfig(data)
  }

  /**
     * @apiGroup config
     * @apiVersion 2.0.0
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
  async function getConfig (opts) {
    return config.getConfig(opts.data)
  }

  /**
     * @apiGroup config
     * @apiVersion 2.0.0
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
  async function delConfig (opts) {
    return config.delConfig(opts.data)
  }

  /**
     * @apiGroup config
     * @apiVersion 2.0.0
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
  async function listConfig (opts) {
    opts.data.root = opts.params.root || null
    return config.listConfig(opts.data)
  }

  /**
     * @apiGroup config
     * @apiVersion 2.0.0
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
  async function setConfigs (opts) {
    opts.data.root = opts.params.root || null
    let data = opts.data
    if (data.json) {
      try {
        data.value = JSON.parse(data.value)
      } catch (e) {
        return consts.ERR.FA_PARSE_CONFIG
      }
    }
    return config.setConfigs(data)
  }

  /**
     * @apiGroup config
     * @apiVersion 2.0.0
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
  async function delRoot (opts) {
    opts.data.root = opts.params.root || null
    let data = opts.data
    return config.delRoot(data)
  }

  const router = ms.router()
  router
    .use(function (opts) {
      opts.data = opts.data || {}
    })
    .add('/:root/:key', 'get', [validator, getConfig])
    .add('/:root/:key', 'post', [validator, setConfig])
    .add('/:root/:key', 'delete', [validator, delConfig])
    .add('/:root', 'get', listConfig)
    .add('/:root', 'post', setConfigs)
    .add('/:root', 'delete', delRoot)

  return router
}
