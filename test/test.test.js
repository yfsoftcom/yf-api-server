var should = require("chai").should();
var _ = require("underscore");
describe('TEST', function(){
    //it('test _clone json', function(done){
    //
    //    var s = _.clone({a:123});
    //    console.log(s);
    //    s = _.clone({a:123,val:{b:123}});
    //    console.log(s);
    //    done();
    //});
    //
    //it('test hook', function(done){
    //
    //    hook.addHook('create_start',function(){console.log(100);},100);
    //    hook.addHook('create_start',function(){console.log(20);},20);
    //    hook.addHook('create_start',function(){console.log(200);},200);
    //
    //    done();
    //});

    it('test substr', function(done){
        var s = 'common.foo@0.0.1';
        var method = s;
        //定位到该接口函数，进行执行
        var p = method.indexOf('@');
        var v = method.substr(p+1);
        method = method.substr(0,p);
        v.should.equal('0.0.1');
        method.should.equal('common.foo');
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