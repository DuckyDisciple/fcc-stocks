"use strict";

var Users = require("../models/users.js");

function UserHandler(){
    
    this.watchStock = function(req,res){
        var myStock = {symbol:req.params.symbol,name:req.params.name};
        Users.findOneAndUpdate({'google.id': req.user.google.id},{$addToSet: {stocks: myStock}})
            .exec(function(err,data){
                if(err) throw err;
                
                res.json(data);
            });
    };
    
    this.getStocks = function(req,res){
        Users.findOne({'google.id':req.user.google.id},{_id:0})
            .exec(function(err, data) {
                if(err) throw err;
                
                res.json(data.stocks);
            });
    };
    
    this.unwatchStock = function(req,res){
        Users.findOneAndUpdate(
            {'google.id':req.user.google.id},
            {$pull: {stocks: {symbol:req.params.symbol}}})
            .exec(function(err, data) {
                if(err) throw err;
                
                res.json(data);
            });
    };
    
    this.getWatchers = function(req,res){
        Users.find({'stocks.symbol':req.params.symbol})
            .exec(function(err,data){
                if(err) return res.json(err);
                var users = data.map(function(doc){
                    return doc.google.displayName;
                });
                return res.json(users);
            });
    };
    
    this.isWatching = function(req,res){
        Users.find({'google.id':req.user.google.id,'stocks.symbol':req.params.symbol})
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