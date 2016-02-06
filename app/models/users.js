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
    location: String,
    places:[{
        id: String,
        name: String,
        desc: String,
        img: String
    }]
});

module.exports = mongoose.model('User', User);