/**
 * 对系统的业务进行钩子设置
 * 将业务开始和完成添加钩子的支持
 **/
var Q = require('q');
var _ = require('underscore');
var E = require('../error');
var async = require('async');

module.exports = (function(){
    //{"":[],"":[]}
    var _hooks = {};
    function addHook(hookName,hookHandler,priority){
        priority = priority || 100;
        if(!_.isFunction(hookHandler)){
            return false;
        }
        var _list = _hooks[hookName] || [];
        _list.push({priority:priority,handler:hookHandler});
        _list = _.sortBy(_list,'priority');
        _hooks[hookName] = _list;
        return true;
    };

    function addAfterHook(hookName,hookHandler,priority){
        return addHook('after_' + hookName,hookHandler,priority);
    };

    function addBeforeHook(hookName,hookHandler,priority){
        return addHook('before_' + hookName,hookHandler,priority);
    }

    /**
     * 执行所有注册了的钩子
     * @param hookName
     * @returns {Function}
     */
    function callHook(hookName,input){
        var _list = _hooks[hookName] || [];
        var q = Q.defer();
        if(_.isEmpty(_list)){
            q.resolve({});
            return q.promise;
        }
        //for()
        async.eachSeries(_list,function(n,cb){
                var h = n.handler(input);
                if(h.then){
                    h.then(function(data){
                        cb(null,data);
                    }).catch(function(err){
                        cb(err);
                    });
                }else{
                    cb(null,h);
                }
            }
            ,function(err,result){
                if(err){
                    L.error(err);
                    q.reject(err);
                }else{
                    q.resolve(result);
                }
            });
        return q.promise;
    }
    return {
        addBeforeHook:addBeforeHook,
        addAfterHook:addAfterHook,
        callHook:callHook
    }
})();
