/**
 * Created by admin on 2016/3/28.
 */
'use strict';
var Q = require('q');
var C = require('../../config');
var FastDBM = require('yf-fast-dbm');
var M = FastDBM(C.db.api);
require('./email')(M);
module.exports = M;