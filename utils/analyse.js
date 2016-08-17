/**
 * 进行接口分析的模块
 */
'use strict';
var Q = require('q');
var async = require('async');
var E = require('../error');
var _ = require('underscore');
var kit = require('./kit.js');
var cache = require('memory-cache');


function logApiRecord(M,data){
  var api_record = cache.get('api_record');
  if(!api_record){
    api_record = [];
  }
  api_record.push(data);
  //缓存100条数据
  if(api_record.length >= 200){
    //保存调用api的数据
    M.create({table:'api_record',row:data});
    //clear;
    api_record = [];
  }

  cache.put('api_record',api_record);
}

module.exports = function(M){
        return function(req,rsp,next){
            var path = req.route.path;
            if(path !== '/api'){
                next();
                return;
            }

            if(_.isString(req.body)){
                req.body = kit.parseQueryString(req.body);
            }
            var data = _.clone(req.body);
            data.createAt = data.updateAt = _.now();
            var p = data.param ;
            if(_.isEmpty(p)){
                delete data.param;
            }else{
                if(_.isObject(p)){
                    p = JSON.stringify(p);
                }
                //屏蔽单引号
                data.param = p.replace(/'/g,'"');
            }
            //保存调用api的数据
            logApiRecord(M,data);
            //验证key和权限
            var appkey = data.appkey;
            //appkey是否在待审核的列表中?
            var method = data.method;
            async.waterfall([
                function(cb){
                    var apps = cache.get('apps');
                    if(apps){
                        cb(null,apps);
                        return;
                    }
                    //初始化应用
                    M.find({table:'api_app',condition:"status = 1 ",limit:999999}).then(function(list){
                        var apps = {};
                        _.each(list,function(item){
                            apps[item.appkey] = item;
                        })
                        cache.put('apps',apps);
                        cb(null,apps);
                    }).catch(function(err){
                        cb(err);
                    });
                },
                function(apps,cb){
                    //读取缓存中的数据
                    if(_.has(apps,appkey)){
                        //验证权限
                        var roots = apps[appkey].approot;
                        if(roots == '*'){
                            //全部权限
                            cb(null);
                            return;
                        }
                        var scope = method.split('.')[0];
                        roots = roots.split(',');
                        if(_.indexOf(roots,scope)>-1){
                            cb(null);
                        }else{
                            cb(2)
                        }
                        cb(null);
                    }else{
                        //拒绝访问
                        cb(1);
                    }
                }
            ],function(err,result){
                if(err === null){
                    next();return;
                }
                if(err === 1){
                    throw new Error(E.System.AUTH_ERROR);
                } else if(err === 2) {
                    throw new Error(E.System.ROOT_ERROR);
                }else{
                    throw new Error(err);
                }
            });
        };
}
