## yf-api-server
### 0.OVERVIEW
> 一款灵活的api服务端，自动集成crud的数据操作，灵活扩展自定义业务逻辑

* 源码地址: https://github.com/yfsoftcom/yf-api-server
* 基于restify框架
* 支持key+secret双端验证
* 支持接口权限验证
* 支持hook钩子操作
* 支持接口多版本同时在线

#### 设计概要

##### 　背景
> 团队的产品从单平台，慢慢扩展到多个客户端，且有多个异构系统的数据交互，所以需要一个统一的数据输入输出口。

- 用node有个人私心，因为喜欢它，虽然编写java已经有近7年的时间了，但我还是想跳出自己的舒适区。
- 使用restify作为http框架，因为它够轻，够简洁，几乎没有学习成本，而且体积小，自然坑也少 [偷笑]。
- 没有使用restful风格，因为业务需要对数据有权限限制，而且业务交集很多，对路由的管理成本就大。
- 经过一小段时间的纠结，决定采用taobao和jd的开放平台的设计方案，定义统一的入口，通过参数定位业务接口，实现灵活的业务开发。

##### 　定义

　　　　服务只有一个入口 **/api** ; 只接受post方式的请求,定义如下

* 传入参数结构

| 参数名 | 类型 | 是否必须 | 参数说明 | 默认值 | 示例 |
|:-------:|:-------:|:-----:|:-----:|:-----:|:-----:|
| method | String | Y | 需要调用的业务函数 | 无 | |
| appkey | String | Y | 应用被分配的密钥 | 无 | |
| timestamp | Number | Y | 应用端的时间戳，用于验证请求的时效性 | 无 | 13位时间戳 |
| v | String | N | 调用的服务端接口的版本号 | 无 | |
| param | Object | N | 业务函数需要用到的参数，以JsonObject的形式传入 | 无 | |
| sign | String | Y | 将接口参数进行升序排列，如 appkey,method,param,timestamp添加一个masterKey=xxx[此处的key来自于注册的key] 组合成appkey=123&masterKey=xxx&param=44444&tmiestamp=140932932932[所有的参数值使用urlencode] 过md5加密，生成一个32位的密钥 | 无 | |

* 输出参数结构

| 参数名 | 类型 | 是否必须 | 参数说明 |
|:-------:|:-------:|:-----:|:-----:|
| errno | Number | Y | 业务函数的错误代码，通常为0，表示正常执行，<0 则表示执行错误，可通过应用说明获取到具体的错误原因。|
| message | String | N | 通常在执行出错的情况下，会输出错误的信息。 |
| timestamp | Number | N | 返回服务端处理完信息之后的时间戳。 |
| data | Object/Array	 | Y |  一般的查询类的业务函数，会在该字段下携带查询结果信息；具体是Object类型还是Array类型则根据不同的业务函数的说明而定。 |
| error | Object | N | 	错误信息的详细内容 |

　　这样的设计不能满足现在的restful范式，但是能满足我们团队现有的需求，提高了业务实现的开发效率；

* 效果预览

![启动服务](http://upload-images.jianshu.io/upload_images/1449977-1bb3e9ec2207730e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


![postman 测试](http://upload-images.jianshu.io/upload_images/1449977-c137a12698a8ca09.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 1.Install
* 依赖不少，请耐心等待几分钟。
`
$ npm install yf-api-server --save
`

* 需要手动创建一下logs记录日志文件的目录
`
$ mkdir logs
`

* 创建一个数据库和两张表
api_app：保存了appkey和secretkey的记录
![api_app](http://upload-images.jianshu.io/upload_images/1449977-078ca165c31fe440.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
api_record:记录每一次的接口请求
![api_record](http://upload-images.jianshu.io/upload_images/1449977-2d19c55eddb8e614.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

SQL脚本
```
--
-- 表的结构 `api_app`
--

CREATE TABLE IF NOT EXISTS `api_app` (
  `id` int(12) NOT NULL AUTO_INCREMENT,
  `appid` int(12) NOT NULL,
  `appname` varchar(120) NOT NULL,
  `apptype` varchar(120) NOT NULL,
  `appkey` varchar(120) NOT NULL,
  `secretkey` varchar(120) NOT NULL,
  `appenvironment` varchar(120) NOT NULL,
  `approot` varchar(120) NOT NULL,
  `createAt` int(32) NOT NULL,
  `updateAt` int(32) NOT NULL,
  `delflag` int(12) NOT NULL,
  `status` int(12) NOT NULL DEFAULT '1',
  `about` varchar(250) NOT NULL,
  `appurl` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `appid` (`appid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 表的结构 `api_record`
--

CREATE TABLE IF NOT EXISTS `api_record` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `appkey` varchar(100) NOT NULL,
  `createAt` bigint(20) NOT NULL,
  `timestamp` bigint(20) NOT NULL,
  `param` varchar(1000) NOT NULL,
  `sign` varchar(100) NOT NULL,
  `v` varchar(100) NOT NULL,
  `method` varchar(100) NOT NULL,
  `updateAt` bigint(20) NOT NULL,
  `delflag` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=9 ;

INSERT INTO `api_app` (`id`, `appid`, `appname`, `apptype`, `appkey`, `secretkey`, `appenvironment`, `approot`, `createAt`, `updateAt`, `delflag`, `status`, `about`, `appurl`) VALUES
(1, 10001, 'YFDemoKey', 'PC', 'a81bc1bb1122323b', '3fc4h39d3ed9b33b67fcbc359131e7ee', 'DEV', '*', 1462610156, 1462773916, 0, 1, 'YF所有，抄袭必究', NULL)

-- 这里的appkey 和 secretkey会在接口调用的时候被使用到
-- appkey : 'a81bc1bb1122323b'
```




### 2.Config
```
$ touch config.js
$ vi config.js
```

```
var k = {
  db:{
      host: '192.168.1.1',
      port:3306,
      username:'root',
      password:'',
  },
  database:{'api':'api'},
  server:{port:8080},
  dev:'DEV'
};

var getDbConfig = function(option){
    var originConfig = {
        host: 'localhost',
        port:3306,
        username:'root',
        password:'',
        debug:false,
        pool:{
            connectionLimit:10,
            queueLimit:0,
            waitForConnections:true
        }
    };
    for(var key in k.db){
        originConfig[key] = k.db[key];
    }
    for(var key in option){
        originConfig[key] = option[key];
    }
    return originConfig;
};
module.exports = {
    db:(function(database){
        var _dbs = {};
        for(var d in database){
            _dbs[d] = getDbConfig({database:database[d]});
        }
        return _dbs;
    })(k.database),
    server: k.server||{
        port: k.dev == 'PRODUCT'?9001:8080
    },
    defaultVersion:'0.0.1',
    dev:k.dev,
    log4js: {
        appenders: [
            { type: 'console' },{
                type: 'file',
                filename: 'logs/access.log',
                maxLogSize: 1024 * 1024 * 100, //100Mb一个文件
                backups:10,
                category: 'normal'
            }
        ],
        replaceConsole: true,
        levels:{
            dateFileLog: 'debug',
            console: 'errno'
        }
    }
};

```

### 3.Code
编写代码，最终的目录结构预览如下

![项目目录](http://upload-images.jianshu.io/upload_images/1449977-7ed3cc46880a3f01.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```
$ mkdir V0.0.2 && cd V0.0.2 && touch index.js && vi index.js
```

```
'use strict';
var _ = require('underscore');
var Q = require('q');
module.exports = function(C,M,H){
  var q = Q.defer();

  M.test = function(){
    var _q = Q.defer();
    _q.resolve({data:"中文和zimu from v0.0.2"})
    return _q.promise;
  }

  q.resolve({'foo':M});  //业务名称： foo.test
  return q.promise;
};

```

```
$ touch app.js
$ vi app.js
```

```
var async = require('async');
var config = require('./config.js');
var M = {};
var v002 = require('./V0.0.2');
var yfserver = require('yf-api-server');
var app = yfserver(config);

async.parallel({
  '0.0.2':function(cb){
    v002(config,M,yfserver.hook).then(function(biz){
      cb(null,biz);
    });
  }
},function(err,results){
    if(err){
      console.log(err);
      return;
    }
    app.setBizModules(results);
    app.start();
  }
);

```
### 4.Run
`
$ node app.js
`

![node app.js](http://upload-images.jianshu.io/upload_images/1449977-d50ed01a85013779.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

postman测试
![postman测试](http://upload-images.jianshu.io/upload_images/1449977-7c444753ed6ec12f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 5.Other
到此，一个能满足基本业务的api服务端就搭建好了
目前我的项目在使用它做生产环境了

![代码结构](http://upload-images.jianshu.io/upload_images/1449977-f3a2a954324d56dd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

pm2 logs

![pm2 logs](http://upload-images.jianshu.io/upload_images/1449977-57ad8df18e055c0f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

欢迎拍砖~~

### 6.Demo

我部署了一个demo项目，代码在这里 [https://github.com/yfsoftcom/yf-demo-api](https://github.com/yfsoftcom/yf-demo-api)

请笑纳~

![测试的](http://upload-images.jianshu.io/upload_images/1449977-b787b6f88cfcc4ae.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
