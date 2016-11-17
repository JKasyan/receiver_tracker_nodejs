var redis = require('redis');
var port = process.env.REDIS_PORT;
var host = process.env.REDIS_HOST;
var pass = process.env.REDIS_PASS;
var client = redis.createClient(port, host);

client.auth(pass, function(err) {
    if(err) throw err;
    console.log('Success connected to redis!');
});

client.hgetall('8suN8drTx6rSksqN5lDL:track', function(err, res) {
    if(err) throw err;
    console.log('2 = ', res);
})

client.hset(['8suN8drTx6rSksqN5lDL:track', 'isActive', false], function (err, res) {
    if(err) throw err;
    console.log('0 = ', res);
    client.hdel(['8suN8drTx6rSksqN5lDL:track', 'id', 'active'], function(err, res) {
        console.log('1 = ', res);
        client.hgetall('8suN8drTx6rSksqN5lDL:track', function(err, res) {
            if(err) throw err;
            console.log('2 = ', res);
        })
    })
});

client.hkeys('8suN8drTx6rSksqN5lDL:track', function(err, res) {
    console.log('3 = ',res);
})