/**
 * Created by 1 on 10/6/2016.
 */
var mongoose = require('mongoose');
var dbURI = process.env.MONGODB_URI;
console.log('dbURI = ' + dbURI);
mongoose.connect(dbURI);
var db = mongoose.connection;

db.on('error', function (err) {
    console.error('connection error:', err.message);
});

db.once('open', function callback () {
    console.info("Connected to DB!");
});

var Schema = mongoose.Schema;

var Point = new Schema({
    id: String,
    lat: Number,
    lng: Number,
    timestamp: Number,
    speed: Number,
    bearing: Number,
    altitude: Number,
    batt: Number
}, {collection: 'Point', versionKey: false});

var PointModel = mongoose.model('Point', Point);
module.exports.PointModel = PointModel;
