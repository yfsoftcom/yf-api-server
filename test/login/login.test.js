var request = require('supertest');
var should = require("should");

request = request('http://localhost:8080');


describe('测试用户登录', function(){
    it('用户登录', function(done){

        var login = { "login_name" : "oA7dTs-98rYcTVacjV6y3a7ALhZg", "type" : "3","login_pass" : "gr100"};
        var data = {method:'api.user.signIn',appkey:'111',timestamp:'1111111',param:login,sign:''};
        request.post('/api')
            .send(data)
            .expect(200)
            .end(function(err,res){
                if(err){
                    return done(err);
                }
                var result = res.body;
                //console.log(result);
                //console.log(result.data.nickname);
                //if(result.code === 0) return done();
                //done(null,result);

                if(result.errno != 0){
                    return done(result.message);
                }
                if(result.data.nickname != "姜砚野"){
                    return done(result.data.nickname);
                }
                if(result.data.level != 2){
                    return done(result.data.level);
                }
                if(result.data.openid != "oA7dTs-98rYcTVacjV6y3a7ALhZg"){
                    return done(result.data.openid);
                }

                done(null,result);

            });
    });
});