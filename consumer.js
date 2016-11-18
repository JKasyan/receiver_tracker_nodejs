/**
 * Created by 1 on 11/18/2016.
 */
var Stomp = require('stomp-client');
var destination = '/queue/queue1';
var client = new Stomp('127.0.0.1', 61613/*, 'user', 'pass'*/);

client.connect(function(sessionId) {
    console.log('sessionId = ', sessionId);
    client.subscribe(destination, function(body, headers) {
        console.log('Gps data = ', body);
    });
});