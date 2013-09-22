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
var run = function(socket,request){
    var username;
    var roomname='public';
    var roomid=0;
    var isJoin=0;
    socket.emit('user_online',{count_user:count,id:socket.id});
    if(isJoin){
        socket.on('createroom',function(data){

            var doc = {
                'roomname': data.room,
                'user': username,
                'status': 0
            };
            conn.collection('chess').insert(doc, {safe:true}, function(err, result) {
                socket.leave(roomname);
                socket.join(result[0]._id);
                roomname=result[0].roomname;
                roomid=result[0]._id;
                socket.broadcast.emit('updateroom',{room:result[0].roomname,name:result[0].user,id:result[0]._id});
                socket.emit('callback',{room:1});
            });

        })
        socket.on('joinroom',function(data){
            var BSON = mongo.BSONPure;
            var o_id = new BSON.ObjectID(data.id);
            conn.collection('chess').find({_id:o_id,status:0}).limit(40).toArray(function(err, items){
                if(items[0]!=null){
                    socket.leave(roomname);
                    socket.join(items[0]._id);
                    roomid= items[0]._id;
                    conn.collection('chess').update({_id:o_id},{$set:{status:1,user2:username}});
                    socket.emit('callback',{joinroom:1,message:"Vào phòng thành công"});
                }else{
                    socket.emit('callback',{message:"Phòng đã đầy"});
                }
            });

        })
        socket.on('message',function(data){
            if(roomid!=0){
                socket.broadcast.to(roomid).emit('message',{message:data.message});
            }
            else
                socket.broadcast.to(roomname).emit('message',{message:data.message});
        })
        socket.on('disconnect',function(){
            if(count>0) count--;
            socket.broadcast.emit('user_online',{count_user:count});
            conn.collection('user').update({username:username},{$set:{online:0}});
            console.log("disconnect");
            if(roomid!=0){
                socket.leave(roomid);
                var BSON = mongo.BSONPure;
                var o_id = new BSON.ObjectID(roomid);
                conn.collection('chess').update({_id:o_id},{$set:{status:0}});
                setTimeout(function() {

                }, 30000);
            }else{
                socket.leave(roomname);
            }
        })
    }else{
        socket.on('login',function(data){
            console.log(data);
            conn.collection('user').find({username:data.username,password:data.password}).limit(1).toArray(function(err, items){
                if(items[0]!=null){
                    if(item[0].online==0){
                        count++;
                        socket.join(roomname);
                        isJoin=1;
                        username=data.username;
                        socket.emit('user_online',{count_user:count,id:socket.id});
                        socket.broadcast.emit('user_online',{count_user:count});
                        conn.collection('user').update({username:data.username},{$set:{online:1}});
                        socket.emit('callback',{login:1,message:"Đăng nhập thành công !"});
                    }else{
                        socket.emit('callback',{message:"Tài khoản đã đang nhập !"});
                    }

                }else{
                    socket.emit('callback',{message:"Tài khoản hoặc mật khẩu không đúng !"});
                }
            });
        })
        socket.on('register',function(data){
            var doc = {
                'username': data.username,
                'password': data.password,
                'status': 0,
                'online':1
            };
            conn.collection('user').find({username:data.username,password:data.password}).limit(1).toArray(function(err, items){
                if(items[0]!=null){
                    socket.emit('callback',{register:0,message:"Tài khoản đã tồn tại !"});
                }else{
                    conn.collection('user').insert(doc, {safe:true}, function(err, result) {
                        count++;
                        socket.join(roomname);
                        isJoin=1;
                        username=data.username;
                        socket.emit('user_online',{count_user:count,id:socket.id});
                        socket.broadcast.emit('user_online',{count_user:count});
                        socket.emit('callback',{register:1,message:"Đăng ký thành công !"});
                    });
                }
            });


        })
    }
}
io.set('match origin protocol', true);
io.set('origins', '*:*');
//io.set('log level', 1);
io.sockets.on('connection', run);
io.sockets.on('disconnect', function(socket) {
    console.log('you are disconnect');
})

