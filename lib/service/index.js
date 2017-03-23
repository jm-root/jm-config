var jm = require('jm-core');
var consts = require('../consts');
var ERR = consts.ERR;
var RootKey = consts.RootKey;

module.exports = function (opts) {
    opts || (opts = {});
    var mq = opts.mq;

    var obj = {
        ready: false,

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
        _parse: function(doc) {
            var self = this;
            try{
                doc = JSON.parse(doc);
                if(doc.expire && doc.time + doc.expire * 1000 < Date.now()){
                    return ERR.config.FA_CONFIG_EXPIRED;
                }else{
                    return doc;
                }
            }catch(e){
                return ERR.config.FA_PARSE_CONFIG;
            }
        },

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
        _stringify: function(opts) {
            var value = opts.value;
            if(value === undefined) value = null;
            var expire = opts.expire || 0;
            var time = Date.now();
            var v = {
                value: value,
                time: time,
                expire: expire
            };
            return JSON.stringify(v);
        },

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
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * 成功响应:
         * doc: 结果(true or false)
         * 错误响应:
         * doc: {
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        setConfig: function(opts, cb) {
            var self = this;
            opts = opts || {};
            var root = opts.root || RootKey;
            var key = opts.key;
            if(!key){
                return cb(new Error(ERR.FA_PARAMS.msg), ERR.FA_PARAMS);
            }
            mq.hset(root, key, this._stringify(opts), function(err, doc) {
                if (err) {
                    cb(err, ERR.config.FA_SET_CONFIG);
                } else {
                    self.emit('setConfig', opts);
                    cb(null, true);
                }
            });
        },

        /**
         * 设置多个配置信息
         * @method config#setConfigs
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  root: 根(可选)
         *  value: 配置对象(可选, 默认{})
         *  expire: 过期时间, 单位秒, 0代表永不过期(可选, 默认0)
         * }
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * 成功响应:
         * doc: 结果(true or false)
         * 错误响应:
         * doc: {
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        setConfigs: function(opts, cb) {
            var self = this;
            opts = opts || {};
            var root = opts.root || RootKey;
            var value = opts.value || {};
            var o = {
                root: root,
                expire: opts.expire || 0
            };
            var v = [];
            for(var key in value){
                var o = {
                    value: value[key],
                    expire: opts.expire || 0
                };
                var val = this._stringify(o);
                v.push(key);
                v.push(val);
            }
            mq.client.hmset(root, v, function(err, doc) {
                if (err) {
                    cb(err, ERR.config.FA_SET_CONFIG);
                } else {
                    self.emit('setConfigs', opts);
                    cb(null, true);
                }
            });
        },

        /**
         * 获取配置信息
         * @method config#getConfig
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  root: 根(可选)
         *  key: 配置项(必填)
         * }
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * 成功响应:
         * doc: 配置值(基本类型, 对象或者数组)
         * 错误响应:
         * doc: {
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        getConfig: function(opts, cb) {
            var self = this;
            opts = opts || {};
            var root = opts.root || RootKey;
            var key = opts.key;
            if(!key){
                return cb(new Error(ERR.FA_PARAMS.msg), ERR.FA_PARAMS);
            }
            mq.hget(root, key, function(err, doc) {
                if (err) {
                    cb(err, ERR.config.FA_GET_CONFIG);
                } else {
                    if(!doc) return cb(null, null);
                    doc = self._parse(doc);
                    if(doc.err){
                        if(doc == ERR.config.FA_CONFIG_EXPIRED){
                            self.delConfig(opts, function(err, doc){});
                        }
                        return cb(new Error(doc.msg), doc);
                    }
                    cb(null, doc.value);
                }
            });
        },

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
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * 成功响应:
         * doc: 结果(true or false)
         * 错误响应:
         * doc: {
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        delConfig: function(opts, cb) {
            var self = this;
            opts = opts || {};
            var root = opts.root || RootKey;
            var key = opts.key;
            if(opts.all){
                return this.delRoot(opts, cb);
            }
            if(!key){
                return cb(new Error(ERR.FA_PARAMS.msg), ERR.FA_PARAMS);
            }
            mq.hdel(root, key, function(err, doc) {
                if (err) {
                    cb(err, ERR.config.FA_DEL_CONFIG);
                } else {
                    self.emit('delConfig', opts);
                    cb(null, true);
                }
            });
        },

        /**
         * 删除根配置, 所有根下面的配置信息都被删除
         * @method config#delRoot
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  root: 根(可选)
         * }
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * 成功响应:
         * doc: 结果(true or false)
         * 错误响应:
         * doc: {
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        delRoot: function(opts, cb) {
            var self = this;
            opts = opts || {};
            var root = opts.root || RootKey;
            mq.del(root, function(err, doc){
                if (err) {
                    cb(err, ERR.config.FA_DEL_CONFIG);
                } else {
                    self.emit('delRoot', opts);
                    cb(null, true);
                }
            });
        },

        /**
         * 列出所有配置项
         * @method config#listConfig
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  root: 根(可选)
         *  all: 是否包含值(可选)
         * }
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * 成功响应:
         * doc: 结果数组或者对象(all=true时)
         * 错误响应:
         * doc: {
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        listConfig: function(opts, cb) {
            var self = this;
            opts = opts || {};
            var root = opts.root || RootKey;
            var _cb = function(err, doc) {
                if (err) {
                    cb(err, ERR.config.FA_LIST_CONFIG);
                } else {
                    if(!doc) {
                        if(opts.all) return cb(null, {});
                        return cb(null, []);
                    }
                    if(opts.all){
                        for(var key in doc){
                            var _doc = self._parse(doc[key]);
                            if(_doc.value){
                                doc[key] = _doc.value;
                            }else{
                                delete doc[key];
                            }
                        }
                    }
                    cb(null, doc);
                }
            };
            if(opts.all){
                mq.hgetall(root, _cb);
            }else{
                mq.hkeys(root, _cb);
            }
        }

    };
    jm.enableEvent(obj);

    var cb_mq = function(){
        obj.ready = true;
    };

    if(typeof opts.mq === 'string') {
        mq = require('jm-mq')({url: opts.mq}, cb_mq);
    } else if(mq){
        obj.ready = true;
    }
    mq || (mq = require('jm-mq')(null, cb_mq));
    obj.mq = mq;

    return obj;
};

