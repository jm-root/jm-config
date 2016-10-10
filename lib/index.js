/**
 * config服务
 * @class config
 * @param {Object} [opts={}] 参数
 * @example
 * opts参数:{
 *  mq: (可选, 如果不填，自动连接默认mq redis://127.0.0.1:6379)
 *  mquri:(可选, 如果不填，自动连接默认mq redis://127.0.0.1:6379)
 * }
 * @returns {Object}
 * @example
 * 返回结果:{
 *  config: config服务
 *  mq: mq服务
 * }
 */
module.exports = function(opts){
    opts = opts || {};
    var o = require('./service')(opts);
    o.router = function(opts) {
        return require('./router')(o, opts);
    };
    return o;
};
