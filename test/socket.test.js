var io = require('socket.io-client');
var uuid = require('uuid');

var clientPool = [];

var POOL_LIMIT = 500;

(function next(i){
    if(i == 0){
        return console.log("pool created");
    }
    console.log(i);
    clientPool.push(io.connect("http://localhost:8080", {'force new connection': true, path : "/path/to"}));

    next(i - 1);
})(POOL_LIMIT);


clientPool.forEach(function(s, i){
    setTimeout(function(){
        s.emit('vote', {"name":"thisIsName", "uniqueid": uuid.v4()});
        s.disconnect();
        console.log('emitted! no.', i);
    }, 130 * i);
});