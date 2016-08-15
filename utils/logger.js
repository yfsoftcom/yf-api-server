var log4js = require('log4js');
var _ = require('underscore');
var config = require('../config.js');

module.exports = function(option){
  option = _.extend(config,option);
  log4js.configure(option.log4js);
  var logger = log4js.getLogger('normal');
  return logger;
}
