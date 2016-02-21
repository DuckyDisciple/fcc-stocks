'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    google:{
        id: String,
        displayName: String,
        email: String,
        token: String
    },
    stocks:[{
        symbol: String,
        name: String
    }]
});

module.exports = mongoose.model('User', User);