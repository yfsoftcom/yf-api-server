var Q = require('q');
var async = require('async');

var tableSql = [
  "CREATE TABLE IF NOT EXISTS `api_app` (\
  `id` int(12) NOT NULL AUTO_INCREMENT,\
  `appid` int(12) NOT NULL,\
  `appname` varchar(120) NOT NULL,\
  `apptype` varchar(120) NOT NULL,\
  `appkey` varchar(120) NOT NULL,\
  `secretkey` varchar(120) NOT NULL,\
  `appenvironment` varchar(120) NOT NULL,\
  `approot` varchar(120) NOT NULL,\
  `createAt` int(32) NOT NULL,\
  `updateAt` int(32) NOT NULL,\
  `delflag` int(12) NOT NULL,\
  `status` int(12) NOT NULL DEFAULT '1',\
  `about` varchar(250) NOT NULL,\
  `appurl` varchar(500) DEFAULT NULL,\
  PRIMARY KEY (`id`),\
  UNIQUE KEY `appid` (`appid`)\
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;"
,
  "CREATE TABLE IF NOT EXISTS `api_record` (\
  `id` bigint(20) NOT NULL AUTO_INCREMENT,\
  `appkey` varchar(100) NOT NULL,\
  `createAt` bigint(20) NOT NULL,\
  `timestamp` bigint(20) NOT NULL,\
  `param` varchar(1000) NOT NULL,\
  `sign` varchar(100) NOT NULL,\
  `v` varchar(100) NOT NULL,\
  `method` varchar(100) NOT NULL,\
  `updateAt` bigint(20) NOT NULL,\
  `delflag` tinyint(4) NOT NULL DEFAULT '0',\
  PRIMARY KEY (`id`)\
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=9 ;"
];
var dataSql = [
  "INSERT INTO `api_app` (`id`, `appid`, `appname`, `apptype`, `appkey`, `secretkey`, `appenvironment`, `approot`, `createAt`, `updateAt`, `delflag`, `status`, `about`, `appurl`) VALUES\
(1, 10001, 'YFDemoKey', 'PC', 'a81bc1bb1122323b', '3fc4h39d3ed9b33b67fcbc359131e7ee', 'DEV', '*', 1462610156, 1462773916, 0, 1, 'YF所有，抄袭必究', NULL)"
];

module.exports = function(M){

  function exec(){
    var q = Q.defer();
    async.series([
      function(callback){
        async.eachSeries(tableSql,function(sql,cb){
          M.adapter.command(sql,function(err,result){
            if(err){
              cb(err);
            }else{
              cb(null,result);
            }
          });
        },function(err,result){
          callback(err,result);
        });
      },
      function(callback){
        async.eachSeries(dataSql,function(sql,cb){
          M.adapter.query(sql,function(err,result){
            if(err){
              cb(err);
            }else{
              cb(null,result);
            }
          });
        },function(err,result){
          callback(err,result);
        });
      }
    ],function(err,result){
      if(err){
        q.reject(err);
      }else{
        q.resolve(result);
      }
    });

    return q.promise;
  }
  return {exec:exec};
};
