"use strict";

var path = process.cwd();
var request = require('request');
var Yelp = require('yelp');

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
        
    // app.route('/login')
    //     .get(function(req,res){
    //         res.sendFile(path+"/client/login.html");
    //     });
    
    // app.route('/logout')
    //     .get(function(req, res) {
    //         req.logout();
    //         res.redirect('/');
    //     });
    
    app.route('/search')
        .get(function(req, res) {
            var location = req.query.loc;
            
            var yelp = new Yelp({
                consumer_key:process.env.YELP_KEY,
                consumer_secret: process.env.YELP_SECRET,
                token: process.env.YELP_TOKEN,
                token_secret: process.env.YELP_TOKEN_SECRET
            });
            
            yelp.search({term: 'bar', location: location, limit: 10})
                .then(function(data){
                    var bars = data.businesses.map(function(val){
                        return {
                            name: val.name,
                            id: val.id,
                            img: val.img_url,
                            desc: val.snippet_text
                        };
                    });
                    res.render('searchResults',{bars: bars});
                })
                .catch(function(err){
                    console.log(err);
                });
        });
    
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
    
    // app.route('/api/:id')
    //     .get(isLoggedIn, function(req, res){
    //         res.json(req.user.google);
    //     });
    
    // app.route('/auth/google')
    //     .get(passport.authenticate('google',{ scope: ['profile','email'] }));
    
    // app.route('/auth/google/callback')
    //     .get(passport.authenticate('google',{
    //         successRedirect: '/',
    //         failureRedirect: '/'
    //     }));
    
    // app.route('/api/:id/clicks')
    //     .get(isLoggedIn, clickHandler.getClicks)
    //     .post(isLoggedIn, clickHandler.addClick)
    //     .delete(isLoggedIn, clickHandler.resetClicks);
};