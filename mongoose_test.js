/**
 * Created by 1 on 10/27/2016.
 */
var models = require('./models/Models')
var util = require('./lib/util')
var Gadget  = models.GadgetModel;
var Point = models.PointModel;
var gadgetsIds = [];

Point.aggregate([
    {$project:
        {lat: 1, lng: 1, timestamp: 1, gadgetNumber: 1}
    },
    {
        $match: {
            gadgetNumber: {$exists: true}
        }
    },
    {
        $group: {
            _id: "$gadgetNumber",
            lastActivity: {$max: "$timestamp"},
            lat: {
                $first:"$lat"
            },
            lng: {
                $first: "$lng"
            }
        }
    }
], function (err, res) {
    console.log(res);
});

/*Gadget.find(function (err, gadgets) {
    if(err) throw err;
    console.log('Gadgets size = ', gadgets.length);
    gadgets.forEach(function (gadget) {
        gadgetsIds.push(gadget._id.toString());
    });
    console.log(util.classOf(gadgetsIds[0]));
    Point.aggregate([
        /!*{$project:{lat:1, lng:1, timestamp:1}},*!/
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
        console.log(res);
    });
});*/

/*
Point.count({lng:50}, function (err, result) {
    if(err) throw err;
    console.log('Point = ', result);
});*/
