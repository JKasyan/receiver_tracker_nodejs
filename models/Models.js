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
    batt: Number,
    gadgetNumber: String
}, {collection: 'Point', versionKey: false});

var PointModel = mongoose.model('Point', Point);
module.exports.PointModel = PointModel;

/**
 *
 */

var Gadget = new Schema({
    id:String,
    userId:String,
    title:String,
    number:String
}, {collection: 'Gadget', versionKey: false});

var GadgetModel = mongoose.model('Gadget', Gadget);

module.exports.GadgetModel = GadgetModel;

/**
 *
 */

var User = new Schema({
    id:String,
    firstName:String,
    secondName:String,
    email:String,
    enabled:Boolean,
    gadgetIds:Array
}, {collection: 'User', versionKey: false});

var UserModel = mongoose.model('User', User);

module.exports.UserModel = UserModel;

var Track = new Schema({
    id: String,
    begin: {
        lat:Number,
        lng:Number,
        time:Number
    },
    finish: {
        lat:Number,
        lng:Number,
        time:Number
    },
    active: Boolean
}, {collection: 'Track', versionKey: false});

var TrackModel = mongoose.model('Track', Track);

module.exports.TrackModel = TrackModel;