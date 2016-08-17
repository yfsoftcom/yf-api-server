var restify = require('restify');
var C = require('../config.js');
var _ = require('underscore');
var Q = require('q');
var L = require('../utils/logger.js');
var E = require('../error.js');
var upload = require('../utils/upload.js');
var reflecter = require('../utils/reflecter.js');
var hook = require('../utils/hook.js');

var FastDBM = require('yf-fast-dbm');

var server = restify.createServer({
    name:'yf_api_server',versions:[C.defaultVersion]
    //ca:fs.readFileSync('server.key'),
    //cert:fs.readFileSync('./bin/server.crt'),
    //key:fs.readFileSync('./bin/server.key'),
    //passphrase:''
});



function init(config){
    server.use(restify.pre.userAgentConnection());          // work around for curl
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.queryParser());
    server.use(restify.bodyParser());
    //server.use(restify.CORS());

    L = L(config);
    exports.logger = L;

    var M = FastDBM(config.db.api);
    //统计api请求的记录的
    var analyse = require('../utils/analyse.js')(M);
    server.use(analyse);

    //验证api请求的合法性
    var compare = require('../utils/compare.js')(config);
    server.use(compare);

    var job = require('../utils/job.js')(M,reflecter);
    exports.job = job;
    global.C = config;


    server.post({path : '/api' , version: C.defaultVersion} , api);
    //服务的相应情况,用于其它系统对服务进行检测,查看服务的运行状况
    server.get('/test',test);

    server.post('/upload', upload);
}


function api(req, res,next){
    res.setHeader('Access-Control-Allow-Origin','*');

    var v = req.v || C.defaultVersion;
    var method = req.method;
    var param = req.param;
    var timestamp = req.timestamp;
    var p = reflecter.invoke(method,param,v);
    p.then(function(result){
        var success = {"errno":0,
            "message":"",
            "timestamp": _.now(),
            "starttime":timestamp,
            "data":result.data};
        res.json(success);
        if(C){
          if(C.debug === true){
              L.trace('正确执行: '+ JSON.stringify(success));
          }
        }
    }).catch(function(err){
        var error = {"errno":err.errno==undefined?-999:err.errno,
            "code":err.code,
            "message":err.message || "System Error!",
            "timestamp":_.now(),
            "starttime":timestamp,
            "error":err}
        res.json(error);
        L.error('method:' + method + '@' + v + ' At:' + timestamp);
        L.error('param:' + JSON.stringify(param));
        L.error('错误执行: '+ JSON.stringify(error));
        }
    }).finally(function(){
        next();
    });
}

function test(req, res, next) {
    res.json({"errno":0,"timestamp": _.now(),"message":"System Online!"});
    next();
}

/**
 * 捕获未知的异常信息
 */
server.on('uncaughtException', function (req, res, route, e) {
  if(_.has(e,"errno")){
    res.json(e);
  }else{
    E.System.UNCAUGHT_ERROR.error = e.message || 'unknown error!';
    res.json(E.System.UNCAUGHT_ERROR);
    L.error(E.System.UNCAUGHT_ERROR);
  }
  return (false);//强制不允许报错
});


exports = module.exports = createApplication;

function createApplication(options){
    C = _.extend(C,options);
    return {
        start:function(){
            init(C);
            server.listen(C.server.port||8080, function() {
                L.trace('在 %s 模式下运行',C.dev);
                L.trace('%s listening at %s', server.name, server.url);
            });
        },
        setBizModules:function(modules){
            reflecter = reflecter(modules);
        }
    }
};
exports.hook = hook;
