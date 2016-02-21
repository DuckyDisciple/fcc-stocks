"use strict";

var path = process.cwd();

var request = require('request');

// var PollHandler = require(process.cwd()+"/app/controllers/pollHandler.server.js");

var UserHandler = require(process.cwd()+"/app/controllers/userHandler.server.js");

module.exports=function(app, passport){
    
    function isLoggedIn(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }else{
            res.redirect('/login');
        }
    }
    
    // var pollHandler = new PollHandler();
    var userHandler = new UserHandler();
    
    app.route('/')
        .get(function(req,res){
            res.render('index',{});
        });
        
    app.route('/login')
        .get(function(req,res){
            res.sendFile(path+"/client/login.html");
        });
    
    app.route('/logout')
        .get(function(req, res) {
            req.logout();
            res.redirect('/');
        });
    
    app.route('/search')
        .get(function(req, res) {
            var stock = req.query.stock;
            var apiUrl = process.env.MOD_SEARCH_URI + "?input=" + stock;
            request(apiUrl, function(err, response, body){
                if(!err && response.statusCode == 200){
                    var results = JSON.parse(body);
                    res.render('searchResults', {results: results});
                }
            });
        });
    
    app.route('/profile')
        .get(isLoggedIn, function(req, res) {
            res.render('profile',{});
        });
    
    app.route('/stock/:symbol')
        .get(function(req, res) {
            var symb = req.params.symbol;
            var apiUrl = process.env.MOD_STOCK_URI + "?symbol=" + symb;
            request(apiUrl, function(err, response, body) {
                if(!err && response.statusCode == 200){
                    var info = JSON.parse(body);
                    res.render('stock', {stock: info});
                }
            });
        });
    
    app.route('/api/watch/:symbol/:name')
        .post(isLoggedIn, userHandler.watchStock);
    
    app.route('/api/unwatch/:symbol')
        .delete(isLoggedIn, userHandler.unwatchStock);
    
    app.route('/api/watchlist')
        .get(isLoggedIn, userHandler.getStocks);
    
    app.route('/api/users/:symbol')
        .get(userHandler.getWatchers);
        
    app.route('/api/watching/:symbol')
        .get(isLoggedIn, userHandler.isWatching);
    
    // app.route('/api/location/:loc')
    //     .post(isLoggedIn, userHandler.setLocation);
    
    // app.route('/edit')
    //     .get(isLoggedIn, function(req, res) {
    //         res.render('editPoll',{});
    //     });
    
    // app.route('/edit/:id')
    //     .get(isLoggedIn, pollHandler.renderEditPage );
    
    // app.route('/save')
    //     .post(isLoggedIn, pollHandler.savePoll);
    // app.route('/save/:id')
    //     .post(isLoggedIn, pollHandler.savePoll);
    
    // app.route('/addPollToUser/:id/:name')
    //     .get(isLoggedIn, userHandler.addPoll);
        
    // app.route('/removePollFromUser/:id')
    //     .get(isLoggedIn, userHandler.deletePoll);
        
    // app.route('/vote/:id')
    //     .get(pollHandler.renderVotePage);
    
    // app.route('/vote/:id/:selected')
    //     .get(pollHandler.makeVote);
    
    // app.route('/results/:id')
    //     .get(pollHandler.renderResultsPage);
        
    // app.route('/polls')
    //     .get(isLoggedIn, userHandler.getPolls);
        
    // app.route('/delete/:id')
    //     .get(isLoggedIn, pollHandler.deletePoll);
        
    // app.route('/error/')
    //     .get(function(req,res){
    //         res.render('error',{});
    //     });
    
    app.route('/api/:id')
        .get(isLoggedIn, function(req, res){
            res.json(req.user.google);
        });
    
    app.route('/auth/google')
        .get(passport.authenticate('google',{ scope: ['profile','email'] }));
    
    app.route('/auth/google/callback')
        .get(passport.authenticate('google',{
            successRedirect: '/',
            failureRedirect: '/login'
        }));
    
    // app.route('/api/:id/clicks')
    //     .get(isLoggedIn, clickHandler.getClicks)
    //     .post(isLoggedIn, clickHandler.addClick)
    //     .delete(isLoggedIn, clickHandler.resetClicks);
};