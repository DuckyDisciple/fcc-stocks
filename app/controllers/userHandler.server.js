"use strict";

var Users = require("../models/users.js");

function UserHandler(){
    
    this.checkIn = function(req,res){
        var myPlace = {id:req.params.id,name:req.params.name};
        Users.findOneAndUpdate({'google.id': req.user.google.id},{$addToSet: {places: myPlace}})
            .exec(function(err,data){
                if(err) throw err;
                
                res.json(data);
            });
    };
    
    this.getPlaces = function(req,res){
        Users.findOne({'google.id':req.user.google.id},{_id:0})
            .exec(function(err, data) {
                if(err) throw err;
                
                res.json(data.places);
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
    
    this.setLocation = function(userId,location){
        Users.findOneAndUpdate({'google.id':userId},{$set: {'location':location}})
        .exec(function(err,data){
            if(err)throw err;
            // console.log(data);
        });
    };
    
    this.getLocation = function(req,res){
        Users.findOne({'google.id':req.user.google.id},{location:1,_id:0})
            .exec(function(err,data){
                if(err) throw err;
                res.json(data);
            })
    }
    
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
    
    this.loginRedirect = function(req,res){
        Users.findOne({'google.id':req.user.google.id})
            .exec(function(err,data){
                if(err) throw err;
                if(data.location){
                    res.redirect('/search?loc='+data.location);
                }else{
                    res.redirect('/');
                }
            })
    }
}

module.exports = UserHandler;