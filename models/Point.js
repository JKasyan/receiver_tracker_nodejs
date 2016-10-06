/**
 * Created by 1 on 10/6/2016.
 */
var mongoose    = require('mongoose');
mongoose.connect(MONGODB_URI);
var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});

db.once('open', function callback () {
    log.info("Connected to DB!");
});

var Schema = mongoose.Schema;

var Point = new Schema({
    id: String,
    lat: Number,
    lon: Number,
    timestamp: Number,
    speed: Number,
    bearing: Number,
    altitude: Number,
    batt: Number
});

var PointModel = mongoose.model('Point', Point);
module.exports.PointModel = PointModel;