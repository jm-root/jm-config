module.exports = function (opts) {
  var service = this
  var router = require('./config')(service, opts)
  router.use(require('./help')(service))
  return router
}
