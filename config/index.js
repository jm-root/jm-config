var config = {
    development: {
        port: 20000,
        prefix: '/config',
        ms: [
            {
                type: 'ws'
            },
            {
                type: 'http'
            }
        ]
    },
    production: {
        port: 20000,
        prefix: '/config',
        mq: 'redis://redis:6379',
        ms: [
            {
                type: 'ws'
            },
            {
                type: 'http'
            }
        ]
    }
};

var env = process.env.NODE_ENV||'development';
config = config[env]||config['development'];
config.env = env;

{
    var env = process.env;
    config.mq = env.mq || config.mq;
}

module.exports = config;
