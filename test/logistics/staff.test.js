var request = require('supertest');
var should = require("should");

request = request('http://localhost:8080');


describe('TEST Logistics', function(){
    it('add user', function(done){
        var user = { "username" : "test", "email" : "marcus@marcus.com","phone":"13770683580","area":"A"};
        var data = {method:'logistics.staff.add',appkey:'111',timestamp:'1111111',param:user};
        request.post('/api')
            .send(data)
            .expect(200)
            .end(function(err,res){
                if(err){
                    return done(err);
                }
                var result = res.body;
                console.log(result);
                if(result.code === 0) return done();
                done(null,result);
            });
    });
});
