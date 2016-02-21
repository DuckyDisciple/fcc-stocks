'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Recent = new Schema({
    searches:[{
        symbol: String,
        name: String
    }]
});

module.exports = mongoose.model('Recent', Recent);