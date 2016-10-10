var jm = require('jm-core');

module.exports = function (opts) {
    opts = opts || {};
    if(opts.mquri) opts.url = opts.mquri;
    var mq = opts.mq || require('jm-mq')(opts);
    var o = {
        /**
         * mq
         * @member config#mq
         */
        mq: mq
    };

    jm.enableEvent(o);
    o.config = require('./config')(o, opts);
    return o;
};

