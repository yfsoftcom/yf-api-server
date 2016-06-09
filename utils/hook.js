/**
 * 对系统的业务进行钩子设置
 * 将业务开始和完成添加钩子的支持
 **/
var Q = require('q');
var config = require('../config');
var _ = require('underscore');
var L = require('../logger.js');
var E = require('../error');

module.exports = (function(){
    //{"":[],"":[]}
    var _hooks = {};
    function addHook(hookName,hookHandler,priority){
        priority = priority || 100;
        if(!_.isFunction(hookHandler)){
            L.error('传入的钩子为非函数');
            return;
        }
        var _list = _hooks[hookName] || [];
        _list.push({priority:priority,handler:hookHandler});
        _list = _.sortBy(_list,'priority');
        _hooks[hookName] = _list;
        L.info(_hooks);
    }

    /**
     * 执行所有注册了的钩子
     * @param hookName
     * @returns {Function}
     */
    function callHook(hookName,input,output,next){
        var _list = _hooks[hookName] || [];
        if(_.isEmpty(_list)){
            return function(input,output,next){
                next();
            }
        }
        //TODO:修改一下，是否需要将参数进行修改后，传入到之后的函数处理？
        //for()
        return function(input,output,next){
            //

        }
    }
    return {
        addHook:addHook,
        callHook:callHook
    }
})();