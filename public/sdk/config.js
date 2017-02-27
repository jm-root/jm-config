var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('../../sdk');
    Promise = require('bluebird');
}
var sdk = jm.sdk;
var logger = sdk.logger;
var utils = sdk.utils;
var config = sdk.config;

config.on('open', function(){
    (function(){

        var configs = {
            test: {
                root: 'root',
                key: 'test',
                value: 123
            },
            testJSON: {
                root: 'root',
                key: 'testJSON',
                value: {
                    name: 'testJSON',
                    age: 100
                },
                expire: 3
            }
        };

        var log = function(err, doc){
            if (err) {
                logger.error(err.stack);
            }
            if(doc){
                logger.debug('%s', utils.formatJSON(doc));
            }
        };

        var done = function(resolve, reject, err, doc){
            log(err, doc);
            if (err) {
                reject(err, doc);
            } else {
                resolve(doc);
            }
        };

        var get = function(root){
            return new Promise(function(resolve, reject){
                logger.debug('%s 获取配置信息', root);
                config.getConfig(configs[root], function(err, doc){
                    log(err, doc);
                    resolve(doc);
                });
            });
        };


        var set = function(root){
            return new Promise(function(resolve, reject){
                logger.debug('%s 设置配置信息', root);
                config.setConfig(configs[root], function(err, doc){
                    done(resolve, reject, err, doc);
                });
            });
        };

        var sets = function(root){
            return new Promise(function(resolve, reject){
                logger.debug('%s 设置多个配置信息', root);
                var opts = {
                    root: 'root',
                    value: {
                        db: 'mongodb://test:123@mongo/sso',
                        mq: 'redis://redis:6379',
                        mq_public: 'redis://redis_public:6379',
                        sdk_server: 'http://sdk:20200'
                    }
                };
                config.setConfigs(opts, function(err, doc){
                    done(resolve, reject, err, doc);
                });
            });
        };

        var del = function(root){
            return new Promise(function(resolve, reject){
                logger.debug('%s 删除配置信息', root);
                config.delConfig(configs[root], function(err, doc){
                    done(resolve, reject, err, doc);
                });
            });
        };

        var list = function(root){
            return new Promise(function(resolve, reject){
                logger.debug('%s 获取配置项列表', root);
                config.listConfig(configs[root], function(err, doc){
                    done(resolve, reject, err, doc);
                });
            });
        };

        var all = function(root){
            return new Promise(function(resolve, reject){
                logger.debug('%s 获取配置项列表及值', root);
                var opts = {
                    root: configs[root].root,
                    all: true
                };
                config.listConfig(opts, function(err, doc){
                    done(resolve, reject, err, doc);
                });
            });
        };

        var delRoot = function(root){
            return new Promise(function(resolve, reject){
                logger.debug('%s 删除根配置', root);
                var opts = {
                    root: configs[root].root
                };
                config.delRoot(opts, function(err, doc){
                    done(resolve, reject, err, doc);
                });
            });
        };

        set('test')
            .then(function(doc){
                return list('test');
            })
            .then(function(doc){
                return all('test');
            })
            .then(function(doc){
                return del('test');
            })
            .then(function(doc){
                return sets('test');
            })
            .then(function(doc){
                return get('test');
            })
            .then(function(doc){
                return set('test');
            })
            .then(function(doc){
                return get('test');
            })
            .then(function(doc){
                return delRoot('test');
            })
            .then(function(doc){
                return set('testJSON');
            })
            .then(function(doc){
                return all('test');
            })
            .catch(SyntaxError, function(e) {
                logger.error(e.stack);
            })
            .catch(function(e) {
                logger.error(e.stack);
            });

    })();
});

