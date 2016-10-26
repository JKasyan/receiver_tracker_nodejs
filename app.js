/**
 * Created by 1 on 10/6/2016.
 */
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 9000;
var cors = require('cors');
var redisClient = require('./routes/redisClient');
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
var Point = require('./models/Models').PointModel;
//
app.get('/', function(req, res) {
    req.query.lng = req.query.lon;
    req.query.gadgetNumber = req.query.id;
    delete req.query.lon;
    delete req.query.id;
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

var Gadget = require('./models/Models').GadgetModel;
var User = require('./models/Models').UserModel;

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
            redisClient.initUsersData(gadgetInfo);
        });
}

function initLastActivity() {

}
