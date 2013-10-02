
/*
 Node.js server script
 Required node packages: express, redis, socket.io
 */
const PORT = process.env.PORT || 8080;
const HOST = process.env.IP || '127.0.0.1';

var redis = require("redis"),
    client = redis.createClient(6379, HOST);

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("error", function (err) {
    console.log("Error " + err);
});

var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
//if (cluster.isMaster) {
//    // Fork workers.
//
//    for (var i = 0; i < numCPUs; i++) {
//        cluster.fork();
//    }
//    cluster.on('exit', function(worker, code, signal) {
//        console.log('worker ' + worker.process.pid + ' died');
//    });
//} else {
//    var ran_name = Math.floor((Math.random()*68686868)+6);
//    var d = new Date();
//    var doc1 = {
//        'name': 'insert product ' + ran_name,
//        'review_count': 0,
//        'hit': 0,
//        'ts': d.getTime(),
//        'total_rate' : 0,
//        'total_point' : 0
//    };
//    client.hmset('product', doc1, function(err, replies) {
//        console.log("Err: " + err);
//        console.log("Replies: " + replies);
//    });
//    client.hgetall('product',function(err,reply){
//        console.log("Err: " + err);
//        console.log("Replies: " + reply.name);
//    })
//}
    client.hgetall('product',function(err,reply){
        console.log("Err: " + err);
        console.log("Replies: " + reply.name);
    })