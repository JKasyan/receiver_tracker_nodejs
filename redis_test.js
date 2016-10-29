var redis = require('redis');
var port = process.env.REDIS_PORT;
var host = process.env.REDIS_HOST;
var pass = process.env.REDIS_PASS;
var client = redis.createClient(port, host);

client.auth(pass, function(err) {
    if(err) throw err;
    console.log('Success connected to redis!');
});

client.get('580e2049dcba0f042d5dedea:lastActivity', function (err, res) {
    console.log(res)
});