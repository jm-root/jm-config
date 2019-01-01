define({ "api": [
  {
    "group": "config",
    "version": "2.0.0",
    "type": "delete",
    "url": "/:root/:key",
    "title": "删除配置信息",
    "name": "delConfig",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "ret",
            "description": "<p>返回结果</p>"
          }
        ],
        "Error 200": [
          {
            "group": "Error 200",
            "type": "Number",
            "optional": false,
            "field": "err",
            "description": "<p>错误代码</p>"
          },
          {
            "group": "Error 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>错误信息</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "成功:",
        "content": "{\n  ret: true\n}",
        "type": "json"
      },
      {
        "title": "失败:",
        "content": "{\n  ret: false\n}",
        "type": "json"
      },
      {
        "title": "错误:",
        "content": "{\n  err: 错误代码\n  msg: 错误信息\n}",
        "type": "json"
      }
    ],
    "filename": "./config.js",
    "groupTitle": "config",
    "sampleRequest": [
      {
        "url": "http://localhost:20000/config/:root/:key"
      }
    ]
  },
  {
    "group": "config",
    "version": "2.0.0",
    "type": "post",
    "url": "/:root",
    "title": "删除根配置, 所有根下面的配置信息都被删除",
    "name": "delRoot",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "ret",
            "description": "<p>返回结果</p>"
          }
        ],
        "Error 200": [
          {
            "group": "Error 200",
            "type": "Number",
            "optional": false,
            "field": "err",
            "description": "<p>错误代码</p>"
          },
          {
            "group": "Error 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>错误信息</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "成功:",
        "content": "{\n  ret: true\n}",
        "type": "json"
      },
      {
        "title": "失败:",
        "content": "{\n  ret: false\n}",
        "type": "json"
      },
      {
        "title": "错误:",
        "content": "{\n  err: 错误代码\n  msg: 错误信息\n}",
        "type": "json"
      }
    ],
    "filename": "./config.js",
    "groupTitle": "config",
    "sampleRequest": [
      {
        "url": "http://localhost:20000/config/:root"
      }
    ]
  },
  {
    "group": "config",
    "version": "2.0.0",
    "type": "get",
    "url": "/:root/:key",
    "title": "获取配置信息",
    "name": "getConfig",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "ret",
            "description": "<p>返回结果</p>"
          }
        ],
        "Error 200": [
          {
            "group": "Error 200",
            "type": "Number",
            "optional": false,
            "field": "err",
            "description": "<p>错误代码</p>"
          },
          {
            "group": "Error 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>错误信息</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "成功:",
        "content": "{\n  ret: 配置值\n}",
        "type": "json"
      },
      {
        "title": "错误:",
        "content": "{\n  err: 错误代码\n  msg: 错误信息\n}",
        "type": "json"
      }
    ],
    "filename": "./config.js",
    "groupTitle": "config",
    "sampleRequest": [
      {
        "url": "http://localhost:20000/config/:root/:key"
      }
    ]
  },
  {
    "group": "config",
    "version": "2.0.0",
    "type": "get",
    "url": "/:root?all=",
    "title": "列出所有配置项",
    "name": "listConfig",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "rows",
            "description": "<p>返回结果</p>"
          }
        ],
        "Error 200": [
          {
            "group": "Error 200",
            "type": "Number",
            "optional": false,
            "field": "err",
            "description": "<p>错误代码</p>"
          },
          {
            "group": "Error 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>错误信息</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "成功:",
        "content": "{\n  rows: 配置项数组\n}\n或者 ?all=1时全部值\n{\n}",
        "type": "json"
      },
      {
        "title": "错误:",
        "content": "{\n  err: 错误代码\n  msg: 错误信息\n}",
        "type": "json"
      }
    ],
    "filename": "./config.js",
    "groupTitle": "config",
    "sampleRequest": [
      {
        "url": "http://localhost:20000/config/:root?all="
      }
    ]
  },
  {
    "group": "config",
    "version": "2.0.0",
    "type": "post",
    "url": "/:root/:key",
    "title": "设置配置信息",
    "name": "setConfig",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "value",
            "description": "<p>配置值</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "expire",
            "defaultValue": "0",
            "description": "<p>过期时间, 单位秒, 0表示永不过期</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "json",
            "defaultValue": "false",
            "description": "<p>value是否json字符串</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "ret",
            "description": "<p>返回结果</p>"
          }
        ],
        "Error 200": [
          {
            "group": "Error 200",
            "type": "Number",
            "optional": false,
            "field": "err",
            "description": "<p>错误代码</p>"
          },
          {
            "group": "Error 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>错误信息</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "成功:",
        "content": "{\n  ret: true\n}",
        "type": "json"
      },
      {
        "title": "失败:",
        "content": "{\n  ret: false\n}",
        "type": "json"
      },
      {
        "title": "错误:",
        "content": "{\n  err: 错误代码\n  msg: 错误信息\n}",
        "type": "json"
      }
    ],
    "filename": "./config.js",
    "groupTitle": "config",
    "sampleRequest": [
      {
        "url": "http://localhost:20000/config/:root/:key"
      }
    ]
  },
  {
    "group": "config",
    "version": "2.0.0",
    "type": "post",
    "url": "/:root",
    "title": "设置多个配置项",
    "name": "setConfigs",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "ret",
            "description": "<p>返回结果</p>"
          }
        ],
        "Error 200": [
          {
            "group": "Error 200",
            "type": "Number",
            "optional": false,
            "field": "err",
            "description": "<p>错误代码</p>"
          },
          {
            "group": "Error 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>错误信息</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "成功:",
        "content": "{\n  ret: true\n}",
        "type": "json"
      },
      {
        "title": "失败:",
        "content": "{\n  ret: false\n}",
        "type": "json"
      },
      {
        "title": "错误:",
        "content": "{\n  err: 错误代码\n  msg: 错误信息\n}",
        "type": "json"
      }
    ],
    "filename": "./config.js",
    "groupTitle": "config",
    "sampleRequest": [
      {
        "url": "http://localhost:20000/config/:root"
      }
    ]
  }
] });
