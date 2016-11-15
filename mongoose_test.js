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
    {$sort:
        {timestamp:-1}
    },
    {
        $match: {
            $and:[
                {gadgetNumber:{$exists:true}},
                {gadgetNumber:{$in:['580e2049dcba0f042d5dedea', '916584']}}
            ]
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
    },
    {
        $lookup: {
            from: "Gadget",
            localField: "id",
            foreignField: "id",
            as: "gadget"
        }
    }
], function (err, res) {
    console.log(res[0].gadget);
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
