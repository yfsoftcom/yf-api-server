var Q = require('q');
var _ = require('underscore');
var E = require('../error.js');

function noMethodHandler(args){
    var deferred = Q.defer();
    deferred.reject(E.System.NOT_METHOD);
    return deferred.promise;
}
function versionUndefinedHandler(args){
    var deferred = Q.defer();
    deferred.reject(E.System.VERSION_UNDEFINED);
    return deferred.promise;
}


module.exports = function(bizModule){
    var getFunction = function(method,v){
        if(!_.has(bizModule,v)){
            return versionUndefinedHandler;
        }
        var path = method.split('.');
        var len = path.length;
        var obj = bizModule[v];
        var handler = noMethodHandler;
        var hasFunction = true;
        for(var i = 0;i<len;i++){
            obj = obj[path[i]];
            //handler = obj;
            //未定位到任何的函数
            if(!obj){
                hasFunction = false;
                break;
            }
        }
        if(hasFunction){
            handler = obj;
        }
        return handler;
    };
    return {
        invoke:function(method,args,v){
            var handler = getFunction(method,v);
            var deferred = Q.defer();
            handler(args).then(function(data){
                //自定义的错误
                if(0 > data.errno ){
                    deferred.reject(data);
                }
                deferred.resolve({"data":data});
            }).catch(function(err){
                if(err.errno > 0)
                    err.errno = 0 - err.errno;
                deferred.reject(err);
            });
            return deferred.promise;
        }
    }
}