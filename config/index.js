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

['port', 'prefix', 'mq'].forEach(function(key) {
    process.env[key] && (config[key]=process.env[key]);
});

module.exports = config;
