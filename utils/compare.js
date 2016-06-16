'use strict';
var _ = require('underscore');
var kit = require('./kit.js');
var C = require('../config');
var L = require('../logger.js');
var E = require('../error');
var crypto = require('crypto');
var cache = require('memory-cache');

module.exports = function(req,res,next){
    var path = req.route.path;
    if(path !== '/api'){
        next();
        return;
    }
    compare(req,res,next);
}

function compare(req,res,next){
    //非空验证
    if(_.isString(req.body)){
        req.body = kit.parseQueryString(req.body);
    }
    var checkResult = checkArgs(req.body);
    if(checkResult.errno < 0 ){
        res.json(checkResult);
        return;
    };
    //需要请求的函数名
    var method = req.body.method;
    //客户端的应用密钥
    var appkey = req.body.appkey;
    //接口版本
    var v = req.body.v || C.defaultVersion;
    //时间戳
    var timestamp = req.body.timestamp;

    timestamp = parseInt(timestamp);

    if('DEV' != C.dev){
        //两个时间内的时间戳不能相差过大
        var delta = _.now() - timestamp;

        if(Math.abs(delta/100/60) > 30){
            res.json(E.System.TIMEZONE_OVER);
            return;
        }
    }

    var param = req.body.param;

    if(_.isString(param)){
        try{
            param = JSON.parse(param);
        }catch(e){
            //传入的param不是JSON格式
            res.json(E.System.PARAM_IS_NOT_JSON);
            return;
        }
    }
    req.v = v;
    req.method = method;
    req.param = param;
    req.timestamp = timestamp;
    next();
}


function checkArgs(args){
    if(!args){
        return E.System.NO_POST_DATA;
    }
    var argArray = 'method,appkey,timestamp,sign'.split(',');
    var len = argArray.length;
    for(var i = 0; i < len; i++){
        var a = argArray[i];
        if(!args.hasOwnProperty(a)){
            return E.System.LOST_PARAM( a );
        }
    }
    //if(!sign(args)){
    //验证数据的完整性
    if(!sign(args) && 'DEV' != C.dev){
        return E.System.SIGN_ERROR;
    }
    return {"errno":0};
}

/**
 * 将传入的参数做一个签名的验证，确认其身份和数据的完整性
 * @param args
 */
function sign (args){
    var md5 = crypto.createHash('md5');
    var sign = args.sign;
    delete args.sign;
    var apps = cache.get('apps');
    if(apps){
        args['masterKey'] = apps[args.appkey].secretkey;
    }else{
        args['masterKey'] = '123';
    }
    var ks = [];
    for(var k in args){
        ks.push(k);
    }
    ks = ks.sort();
    var strArgs = [];
    ks.forEach(function(item){
        var val = args[item];
        if(_.isObject(val)){
            val = JSON.stringify(val);
        }
        strArgs.push(item+'='+encodeURIComponent(val));
    });
    var content = strArgs.join('&');
    L.trace('拼接内容:' + content);
    md5.update(content);
    var d = md5.digest('hex');
    L.trace('传入参数: '+ JSON.stringify(args));
    L.trace('参数加密: '+d);
    return d == sign;
}