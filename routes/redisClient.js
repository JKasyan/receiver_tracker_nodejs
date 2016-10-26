/**
 * Created by kasyan on 10/26/16.
 */
var redis = require('redis');
var port = process.env.REDIS_PORT;
var host = process.env.REDIS_HOST;
var pass = process.env.REDIS_PASS;
var client = redis.createClient(port, host);

client.auth(pass, function(err) {
    console.log(err);
});

exports.saveActivity = function(key, value) {
    return function(req, res, next) {
        console.log('key = ', key, ', value = ', value);
        client.set(key, value, redis.print);
        next(req, res);
    }
}

exports.saveUsersData = function(data) {
    return function(req, res, next) {
        console.log(data);
        next(req, res);
    }
}

exports.initUsersData = function(data) {
    console.log(data);
    client.mset(data, redis.print);
}