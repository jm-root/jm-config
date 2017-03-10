module.exports = function(opts) {
    var service = this;
    var router = require('./config')(service, opts);

    router.add('/', 'get', function(opts, cb, next){
        opts.help || (opts.help = {});
        opts.help.status = 1;
        if(!service.ready) opts.help.status = 0;
        next();
    });

    require('jm-ms-help');
    jm.ms.enableHelp(router);

    return router;
};
