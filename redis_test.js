var redis = require('redis');
var port = process.env.REDIS_PORT;
var host = process.env.REDIS_HOST;
var pass = process.env.REDIS_PASS;
var client = redis.createClient(port, host);

client.auth(pass, function(err) {
    if(err) throw err;
    console.log('Success connected to redis!');
});

client.set('one', 1, function(err, res) {
    console.log(err, ' ', res);
});

client.exists('one', function (err, res) {
    console.log(res)
});