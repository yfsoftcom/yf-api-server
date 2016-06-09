var socketio = require('socket.io');

module.exports = function(server){
    var io = socketio.listen(server);

    io.sockets.on('connection', function (socket) {
        //socket.emit('news', { hello: 'world' });
        //socket.on('vote', function (data) {
        //    console.log(data);
        //});
    });

}