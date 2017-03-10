var jm = require('jm-core');

module.exports = function (opts) {
    opts || (opts = {});
    var o = {
        ready: false
    };
    var cb_mq = function(){
        o.ready = true;
    };

    var mq = opts.mq;
    if(typeof opts.mq === 'string') {
        mq = require('jm-mq')({url: opts.mq}, cb_mq);
    }
    mq || (mq = require('jm-mq')(null, cb_mq));
    o.mq = mq;

    jm.enableEvent(o);
    o.config = require('./config')(o, opts);
    return o;
};

