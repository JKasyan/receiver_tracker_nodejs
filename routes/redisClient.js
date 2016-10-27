/**
 * Created by kasyan on 10/26/16.
 */
var redis = require('redis');
var port = process.env.REDIS_PORT;
var host = process.env.REDIS_HOST;
var pass = process.env.REDIS_PASS;
var client = redis.createClient(port, host);

client.auth(pass, function(err) {
    if(err) throw err;
    console.log('Success connected to redis!');
});

exports.saveLastActivity = function(key, timestamp) {
    client.set(key, timestamp, redis.print);
}

exports.saveUsersData = function(data) {
    return function(req, res, next) {
        console.log(data);
        next(req, res);
    }
}

exports.initUsersData = function(data) {
    client.mset(data, redis.print);
}

exports.initLastActivity = function (data) {
    client.mset(data, redis.print);
}

exports.checkGadget = function(id) {
    return function(next) {
        client.exists(id, function(err, result) {
            if(err) throw err;
            next();
        })
    }
}