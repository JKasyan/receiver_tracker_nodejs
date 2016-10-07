/**
 * Created by 1 on 10/6/2016.
 */
var app = require('express')();
var server = require('http').Server(app,  {origins: ''});
var io = require('socket.io')(server);
var port = process.env.PORT || 9000;
console.log('port = ' + port);
app.listen(port);
//
var Point = require('./models/Point').PointModel;

app.get('/', function(req, res) {
    req.query.timestamp = req.query.timestamp * 1000;
    console.log(req.query);
    var point = new Point(req.query);
    point.save(function(err){
        if(err) throw err;
        var id = req.query.id;
        if(io.sockets.adapter.rooms[id]) {
            io.to(id).emit('msg', req.query);
        }
        res.send('');
    });
});


//
io.set('origins', 'http://localhost:9000');
io.on('connect', function (socket) {

    console.log(socket.id);

    socket.on('subscribeOnVehicle', function (room) {
        console.log('subscribeOnVehicle = ', room);
        socket.join(room);
    });

    socket.on('onSubscribeOnVehicle', function (room) {
        console.log('subscribeOnVehicle = ', room);
        socket.join(room);
    });

});
