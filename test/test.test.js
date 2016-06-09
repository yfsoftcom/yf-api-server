var should = require("should");
var _ = require("underscore");
var request = require('request');
var hook = require('../utils/hook.js');
describe('TEST', function(){
    it('test _clone json', function(done){

        var s = _.clone({a:123});
        console.log(s);
        s = _.clone({a:123,val:{b:123}});
        console.log(s);
        done();
    });

    it('test hook', function(done){

        hook.addHook('create_start',function(){console.log(100);},100);
        hook.addHook('create_start',function(){console.log(20);},20);
        hook.addHook('create_start',function(){console.log(200);},200);

        done();
    });

    //it('test request',function(done){
    //    request('http://www.baidu.com', function (error, response, body) {
    //        if (!error && response.statusCode == 200) {
    //            console.log(body)
    //        }
    //        done();
    //    })
    //});
});