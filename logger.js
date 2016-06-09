var log4js = require('log4js');
var config = require('./config.js');

log4js.configure(config.log4js);
var logger = log4js.getLogger('normal');

module.exports = logger;