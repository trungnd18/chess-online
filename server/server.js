/**
 * Created by TrungNguyen
 * Date: 7/9/13
 */
var   http        = require('http')
    , fs          = require('fs')
    , socketIO    = require('socket.io')
    , port = process.env.PORT || 8080
    , ip= process.env.IP || '127.0.0.1'
    , mongo = require('mongoskin'); // include thư viện mongodb
var conn = mongo.db('admin:trung18082016@paulo.mongohq.com:10040/quac');
var server      = http.createServer().listen(port, ip, function(){console.log('Server running at %s:%s', ip, port)})
var io          = socketIO.listen(server);
var count=0;
var count_room=0;
var run = function(socket,request){

    var username;
    var roomname;
    socket.on('username',function(data){
        count++;
        console.log(data.name);
        username=data.name;
        socket.emit('user_online',{count_user:count,id:socket.id});
        socket.broadcast.emit('user_online',{count_user:count});
    })
    socket.on('createroom',function(data){
        count_room++;
        socket.join(data.room);
        roomname=data.room;
        socket.broadcast.emit('updateroom',{room:roomname,name:username,count:count_room});
    })
    socket.on('joinroom',function(data){
        socket.join(data.room);
    })
    socket.on('message',function(data){
        console.log(data.message);
        socket.broadcast.emit('message',{message:data.message});
        // socket.broadcast.to(roomname).emit('message',{message:data.message}); 
    })
    socket.on('disconnect',function(){
        if(count>0) count--;
        socket.broadcast.emit('user_online',{count_user:count});
        console.log("disconnect");
    })
}
io.set('match origin protocol', true);
io.set('origins', '*:*');
//io.set('log level', 1);
io.sockets.on('connection', run);
io.sockets.on('disconnect', function(socket) {
    console.log('you are disconnect');
})

