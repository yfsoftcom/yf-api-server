var fs = require('fs');
var C = require('../config.js');
var _ = require('underscore');
var E = require('../error.js');
var qiniu = require("qiniu");
var Q = require('q');

qiniu.conf.ACCESS_KEY = C.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = C.qiniu.SECRET_KEY;

function copy(src, dst) {
    fs.writeFileSync(dst, fs.readFileSync(src));
}

//构建上传策略函数
function uptoken( key) {
    var putPolicy = new qiniu.rs.PutPolicy(C.qiniu.bucket+":"+key);
    return putPolicy.token();
}

//构造上传函数
function uploadFile(uptoken, key, localFile) {
    var q = Q.defer();
    var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
        if(!err) {
            q.resolve({
                hash:ret.hash,
                key:key
            });
            // 上传成功， 处理返回值
        } else {
            // 上传失败， 处理返回代码
            var e = E.System.QINIU_SYNC_ERROR;
            e.error = err;
            q.reject(e);
        }
    });
    return q.promise;
}

function syncQiniu(filename,filepath){
    //生成上传 Token
    var token = uptoken( filename);
    //调用uploadFile上传
    return uploadFile(token, filename, filepath);
}


//只接受
//application/zip,application/json两种格式的文件
//文件长度不能大于100MB
//保存文件
module.exports = function(req, res) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var f = req.files.file;
    var t = f.type;
    var n = f.name;
    var s = f.size;
    if(t!='application/zip' && t!= 'application/x-zip-compressed' && t!='application/octet-stream'){
        res.json(E.System.FILE_TYPE_REJECT);
        return;
    }
    if(s>100*1024*1024){
        res.json(E.System.FILE_TOO_LARGE);
        return;
    }
    //copy(f.path,'uploads/'+f.name);
    syncQiniu(n, f.path).then(function(data){
        res.json({errno:0,data:data});
    }).catch(function(err){
        res.json(err);
    }).finally(function(){
        res.send(200);
    });

};
