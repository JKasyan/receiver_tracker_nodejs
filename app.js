/**
 * Created by 1 on 10/6/2016.
 */
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 9000;
var cors = require('cors');
//
console.log('port = ' + port);
//
var allowCrossDomain = function(req, res, next) {
    console.log('Headers...');
    res.header('Access-Control-Allow-Origin', 'http://obscure-thicket-55734.herokuapp.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
//
app.use(allowCrossDomain);
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
//
var Point = require('./models/Point').PointModel;
//
app.get('/', function(req, res) {
    for(var key in req.query) {
	console.log(key + ' === ' + classOf(key));
    }
    req.query.timestamp = req.query.timestamp * 1000;
    console.log(req.query);
    var point = new Point(req.query);
    point.save(function(err){
        if(err) throw err;
        var id = req.query.id;
        if(io.sockets.adapter.rooms[id]) {
            console.log(io.sockets.adapter.rooms[id]);
            io.to(id).emit('gpsData', req.query);
        }
        res.send('');
    });
});
//
io.on('connect', function (socket) {

    console.log(socket.id);

    socket.on('subscribeOnVehicle', function (room) {
        console.log('subscribeOnVehicle = ', room);
        socket.join(room);
    });

    socket.on('unSubscribeOnVehicle', function (room) {
        console.log('unSubscribeOnVehicle = ', room);
        socket.leave(room);
    });

});

function classOf(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
}

server.listen(port);
