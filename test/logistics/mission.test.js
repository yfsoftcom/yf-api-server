var request = require('supertest');
var should = require("should");

request = request('http://localhost:8080');


describe('TEST Logistics', function(){
    it('push mission', function(done){
        var mission = { "orderid" : "O11123123", "partner" : "maoshanwang","fromAddr":"江苏省扬州市江都区长江路102号","area":"A",
        "toAddr":"江苏省扬州市联运路59号","toName":"王帆","toMobile":"13770683580"};
        var data = {method:'logistics.mission.push',appkey:'111',timestamp:'1111111',param:mission};
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
