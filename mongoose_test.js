/**
 * Created by 1 on 10/27/2016.
 */
var models = require('./models/Models')
var util = require('./lib/util')
var Gadget  = models.GadgetModel;
var Point = models.PointModel;
var User = models.UserModel;
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
                {gadgetNumber:{$in:['8suN8drTx6rSksqN5lDL', 'Mk73RNfJzIkhRduxisit']}}
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
            localField: "_id",
            foreignField: "number",
            as: "gadget"
        }
    },
    {
        $unwind: "$gadget"
    }
], function (err, res) {
    res.forEach(function (el) {
        console.log(el);
        console.log('<<<<<<<<<<<<<<<<<< >>>>>>>>>>>>>>>>>>>>>')
    });
});

/*Point.aggregate([
    {
        $project:{
            lat: 1, lng: 1, gadgetNumber: 1, timestamp: 1
        }
    },
    {
        $limit: 1
    },
    {
        $lookup: {
            from: "Gadget",
            localField: "gadgetNumber",
            foreignField: "number",
            as: "gadgets"
        }
    }
], function(err,res){
    console.log(res[0].gadgets);
});*/

//582c3724dcba0f510dd56504  ->  Mk73RNfJzIkhRduxisit
//580e2049dcba0f042d5dedea  ->  8suN8drTx6rSksqN5lDL
/*
Point.update(
    {
        gadgetNumber: "582c3724dcba0f510dd56504"
    },
    {
        $set: {
            gadgetNumber: "Mk73RNfJzIkhRduxisit"
        }
    },
    {
        multi:true
    },
    function (err, res) {
        if (err) throw err;
        console.log(res);
    }
);*/
