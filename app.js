/**
 * Created by 1 on 10/6/2016.
 */
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 9000;
var cors = require('cors');
//
var Gadget = require('./models/Models').GadgetModel;
var User = require('./models/Models').UserModel;
var Point = require('./models/Models').PointModel;
var Track = require('./models/Models').TrackModel;
//
var redis = require('redis');
var redisPort = process.env.REDIS_PORT;
var redisHost = process.env.REDIS_HOST;
var pass = process.env.REDIS_PASS;
var clientRedis = redis.createClient(redisPort, redisHost);

clientRedis.auth(pass, function(err) {
    if(err) throw err;
    console.log('Success connected to redis!');
});
//
console.log('port = ' + port);
initCache();
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
app.get('/', function(req, res) {
    if(req.query.id) {
        clientRedis.exists(req.query.id, function (err, result) {
            if(err) throw err;
            console.log(req.query.id, ' is exists  = ', Boolean(result));
            if(!result) {
                res.status(500).send('');
                return;
            }
            req.query.lng = req.query.lon;
            req.query.gadgetNumber = req.query.id;
            delete req.query.lon;
            delete req.query.id;
            console.log('query data = ',req.query);
            //
            var point = new Point(req.query);
            point.save(function(err){
                if(err) throw err;
                var gadgetNumber = req.query.gadgetNumber;
                if(io.sockets.adapter.rooms[gadgetNumber]) {
                    console.log(io.sockets.adapter.rooms[gadgetNumber]);
                    io.to(gadgetNumber).emit('gpsData', req.query);
                }
                res.send('');
            });
        });
    } else {
        res.status(500).send('');
    }
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

server.listen(port);


function initCache() {
    User.where('enabled')
        .eq(true)
        .select({email:1,gadgetIds:1})
        .exec(function(err, data) {
            if(err) throw err;
            var gadgetInfo = [];
            console.log('Number of users = ', data.length);
            data.forEach(function(user) {
                for(var i = 0; i <user.gadgetIds.length;i++) {
                    gadgetInfo.push(user.gadgetIds[i]);
                    gadgetInfo.push(user.email);
                }
            });
            console.log('gadgetInfo = ', gadgetInfo);
            clientRedis.mset(gadgetInfo, function(err, res) {
                if(err) throw err;
                console.log('Success save cache = ', res)
            });
        });
}
