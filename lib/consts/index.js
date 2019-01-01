let ERRCODE_CONFIG = 1000

module.exports = {
  RootKey: 'config_root',
  ERR: {
    FA_PARAMS: {
      err: ERRCODE_CONFIG++,
      msg: '参数错误'
    },
    FA_SET_CONFIG: {
      err: ERRCODE_CONFIG++,
      msg: '保存配置信息失败'
    },

    FA_GET_CONFIG: {
      err: ERRCODE_CONFIG++,
      msg: '获取配置信息失败'
    },

    FA_DEL_CONFIG: {
      err: ERRCODE_CONFIG++,
      msg: '删除配置信息失败'
    },

    FA_CONFIG_EXPIRED: {
      err: ERRCODE_CONFIG++,
      msg: '配置信息已过期'
    },

    FA_PARSE_CONFIG: {
      err: ERRCODE_CONFIG++,
      msg: '无法解析配置信息'
    },

    FA_LIST_CONFIG: {
      err: ERRCODE_CONFIG++,
      msg: '获取配置项列表失败'
    }
  }
}
