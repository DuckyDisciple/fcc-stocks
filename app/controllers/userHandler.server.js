"use strict";

var Users = require("../models/users.js");

function UserHandler(){
    
    this.checkIn = function(req,res){
        var myPlace = {id:req.params.id,name:req.params.name};
        Users.findOneAndUpdate({'google.id': req.user.google.id},{$push: {places: myPlace}})
            .exec(function(err,data){
                if(err) throw err;
                
                res.json(data);
            });
    };
    
    this.getPlaces = function(req,res){
        Users.findOne({'google.id':req.user.google.id},{_id:0})
            .exec(function(err, data) {
                if(err) throw err;
                
                res.json(data);
            });
    };
    
    this.checkOut = function(req,res){
        Users.findOneAndUpdate(
            {'google.id':req.user.google.id},
            {$pull: {places: {id:req.params.id}}})
            .exec(function(err, data) {
                if(err) throw err;
                
                res.json(data);
            });
    };
    
    // this.setLocation
    this.getCheckIns = function(req,res){
        Users.find({'places.id':req.params.id})
            .exec(function(err,data){
                if(err) return res.json(err);
                var users = data.map(function(doc){
                    return doc.google.displayName;
                });
                return res.json(users);
            });
    };
    
    this.isCheckedIn = function(req,res){
        Users.find({'google.id':req.user.google.id,'places.id':req.params.id})
            .exec(function(err, data) {
                if(err) res.json({found:false});
                if(data.length>0){
                    res.json({found:true});
                }else{
                    res.json({found:false});
                }
            });
    };
}

module.exports = UserHandler;