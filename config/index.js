var config = {
    development: {
        port: 20000,
        modules: {
            config: {
                module: process.cwd() + '/lib'
            }
        }
    },
    production: {
        port: 20000,
        mq: 'redis://redis.db',
        modules: {
            config: {
                module: process.cwd() + '/lib'
            }
        }
    }
};

var env = process.env.NODE_ENV||'development';
config = config[env]||config['development'];
config.env = env;

module.exports = config;
