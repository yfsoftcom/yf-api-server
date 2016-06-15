'use strict';
var Q = require('q');
var C = require('../../config.js');
var FastDBM = require('yf-fast-dbm');
var M = FastDBM(C.db.api);
var H = require('../../utils/hook.js');
M.foo = function(){
    var q = Q.defer();
    M.count({table:'api_app'}).then(function(c){
        q.resolve(c);
    }).catch(function(err){
        q.reject(err);
    })
    return q.promise;
};
H.addBeforeHook('common.foo',function(input){
    console.log(input);
    return 1;
},100);
H.addBeforeHook('common.foo',function(input){
    var q = Q.defer();
    M.count({table:'api_app'}).then(function(c){
        q.resolve(c);
    }).catch(function(err){
        q.reject(err);
    })
    return q.promise;
},10);
H.addAfterHook('common.foo',function(input){
    console.log(input);
    return 1;
},1);
H.addAfterHook('common.foo',function(input){
    console.log(input);
    return 1;
},100);
module.exports = M;