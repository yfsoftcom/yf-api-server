var request = require('supertest');
var should = require("should");

request = request('http://localhost:8080');


describe('GET /user', function(){
    it('respond with json', function(done){
        request.get('/test')
            .expect(200)
            .end(function(err,res){
                if(err) return done(err);
                var result = res.body;
                if(result.code === 0) return done();
                done(result);
            });
    });
});
