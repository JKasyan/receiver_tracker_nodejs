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
var Gadget = require('./models/Models').GadgetModel;
var User = require('./models/Models').UserModel;
var Point = require('./models/Models').PointModel;
//
console.log('port = ' + port);
initCache();
initLastActivity();
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
    req.query.lng = req.query.lon;
    req.query.gadgetNumber = req.query.id;
    delete req.query.lon;
    delete req.query.id;
    console.log(req.query);
    var point = new Point(req.query);
    point.save(function(err){
        if(err) throw err;
        var gadgetNumber = req.query.gadgetNumber;
        if(io.sockets.adapter.rooms[gadgetNumber]) {
            console.log(io.sockets.adapter.rooms[gadgetNumber]);
            io.to(gadgetNumber).emit('gpsData', req.query);
        }
        if(query.timestamp) {
            var keyLastActivity = gadgetNumber + ':lastActivity';
            redisClient.saveLastActivity(keyLastActivity, query.timestamp);
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
            console.log(gadgetInfo);
            redisClient.initUsersData(gadgetInfo);
        });
}

function initLastActivity() {
    var gadgetsIds = [];
    var lastActivity = [];
    Gadget.find(function (err, gadgets) {
        if(err) throw err;
        console.log('Gadgets size = ', gadgets.length);
        gadgets.forEach(function (gadget) {
            gadgetsIds.push(gadget._id.toString());
        });
        Point.aggregate([
            {$match:{
                $and:[
                    {gadgetNumber:{$exists:true}},
                    {gadgetNumber:{$in:gadgetsIds}}
                ]
            }},
            {$group:{
                _id:"$gadgetNumber",
                lastActivity: {$max:"$timestamp"}
            }}
        ], function (err, res) {
            if(err) throw err;
            console.log('Last activity = ', res);
            res.forEach(function (aggregation) {
                lastActivity.push(aggregation._id + ':lastActivity');
                lastActivity.push(aggregation.lastActivity);
            });
            if(lastActivity.length) {
                console.log('Last activity array format = ', lastActivity);
                redisClient.initLastActivity(lastActivity);
            }
        });
    });
}
