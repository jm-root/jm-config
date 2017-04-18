require('log4js').configure(__dirname + '/log4js.json');
var config = {
    development: {
        port: 20000,
        modules: {
            config: {
                module: process.cwd() + '/lib'
            },
            'jm-config-mq': {}
        }
    },
    production: {
        port: 20000,
        mq: 'redis://redis.db',
        modules: {
            config: {
                module: process.cwd() + '/lib'
            },
            'jm-config-mq': {}
        }
    }
};

var env = process.env.NODE_ENV||'development';
config = config[env]||config['development'];
config.env = env;

if(process.env['disableMQ']) delete config.modules['jm-config-mq'];

module.exports = config;
