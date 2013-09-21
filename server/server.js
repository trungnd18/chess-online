/**
 * Created by mR.Rikky™
 * Date: 6/15/13
 * Time: 1:23 AM
 */

var   http        = require('http')
    , fs          = require('fs')
    , socketIO    = require('socket.io')
    , port        = process.env.PORT || 8080
    , ip          = process.env.IP || '127.0.0.1';
const redis = require('redis');
const client = redis.createClient();


var serving     = function(req, res){
    console.log(req.url);if(req.url == '/'){
        fs.readFile('index.html',function(error,data){
            if(error) {
                throw error;
            } else {
                res.writeHead(200,{'Content-Type':'text/html'});
                res.end(data);
            }
        })
    }
    if(req.url == '/client.js'){
        fs.readFile('client.js',function(error,data){
            if(error){
                throw error;
            } else {
                res.writeHead(200,{'Content-Type':'text/javscript'});
                res.end(data);
            }
        })
    }


}
var server      = http.createServer(serving).listen(port, ip, function(){console.log('Server running at %s:%s', ip, port)})
var io          = socketIO.listen(server);
var run = function(socket,client){
    // Main socket process here!
    const subscribe = redis.createClient();
    subscribe.subscribe('realtime');
    subscribe.on("message", function(channel, message) {
        client.send(message);
    });
    client.on('message', function(msg) {
    });

    client.on('disconnect', function() {
        subscribe.quit();
    });
    console.log("welcome");
    socket.emit('greeting', 'Welcome to Chat demo');
}



io.set('match origin protocol', true);
io.set('origins', '*:*');
//io.set('log level', 1);

io.sockets.on('connection', run);

