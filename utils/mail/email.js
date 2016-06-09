/**
 * Created by admin on 2016/3/28.
 */
var nodemailer = require('nodemailer');
var Q = require('q') ;
var async = require('async') ;
var config = require('../../config') ;
var E = require('../../error');
var transport = nodemailer.createTransport('smtps://'+encodeURI(config.EMail.email)+':'+config.EMail.pass+'@'+config.EMail.smtp);

//��ȡģ��Ͷ���������
var mail_temp = function(M,id){
    var q = Q.defer() ;
    async.auto({
        f0:function(cb){
            var arg = {table:'mail_template',condition:' id='+id};
            M.first(arg).then(function(data){
                cb(null, data) ;
            }).catch(function(err){
                cb(err) ;
            });
        },
        f1:function(cb){
            var arg = {
                table:'mail_channel',
                condition:' temp_id='+id ,
                fields:" email"
            };
            var mails = [] ;
            M.find(arg).then(function(data){
                if(data.length > 0 ){
                    async.eachSeries(data,function(e,cb1){
                        mails.push(e.email);
                        cb1(null)
                    },function(){
                        cb(null, mails);
                    })
                }else{
                    cb({code:-1});
                }
            }).catch(function(err){
                cb(err) ;
            });
        }
    },function(err,result){
        if(err){
            q.reject(err);
        }else{
            q.resolve({temp:result.f0, mails:result.f1});
        }
    });
    return q.promise;
};

//'<b>Hello, <strong>{{username}}</strong>, Your password is:\n<b>{{ password }}</b></p>'
module.exports = function(M) {
    M.mail = {
        sendMails:function(args){
            var q = Q.defer() ;
            var id = args.id ;
            mail_temp(M, id).then(function(d){
                var temp = d.temp.template,
                    subject = d.temp.subject;
                var mails = d.mails ;
                var sendPwdReminder = transport.templateSender({
                    subject: subject,
                    //html:'<b>Hello, <strong>{{username}}</strong>, Your password is:\n<b>{{ password }}</b></p>'
                    html:temp
                }, {
                    from: config.EMail.email
                });
                sendPwdReminder({
                    //to: mails
                    to: '2091571762@qq.com'
                }, {
                    username:'nico',
                    password:'11111'
                }, function(err, info){
                    if(err){
                        q.reject(E.Mail.SEND_MAILS_ERROR);
                    }else{
                        q.resolve({code:0});
                    }
                });
            }).catch(function(err){
                q.reject(err);
            }) ;
            return q.promise ;
        },
    }
    return M;
};