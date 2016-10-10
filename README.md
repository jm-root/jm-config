jm-config
======

config

use:

var s = require('jm-config')();

//use with express
var app = require('express')();
app.use('/config', s.router());
