'use strict';
var Q = require('q');
var C = require('../../config.js');
var FastDBM = require('yf-fast-dbm');
var M = FastDBM(C.db.api);
M.foo = function(){
    var q = Q.defer();
    M.count({table:'api_app'}).then(function(c){
        q.resolve(c);
    }).catch(function(err){
        q.reject(err);
    })
    return q.promise;
};
module.exports = M;