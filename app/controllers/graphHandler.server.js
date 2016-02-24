"use strict";

var request = require('request');

function GraphHandler(){
    this.getGraph = function(req, res){
        var params = {};
        params.Elements = [{
            Symbol: req.params.symbol,
            Type: "price",
            Params: ["c"]
        }];
        params.NumberOfDays = 365;
        params.DataPeriod = "Day";
        
        var stockHistoryUrl = process.env.MOD_HISTORY_URI;
        stockHistoryUrl += "?parameters=" + JSON.stringify(params);
        request(stockHistoryUrl, function(err, response, body){
                if(!err && response.statusCode == 200){
                    var results = JSON.parse(body);
                    if(results.Elements){
                        var graphData = [];
                        for(var i=0; i<results.Dates.length; i++){
                            graphData.push([Date.parse(results.Dates[i]), results.Elements[0].DataSeries.close.values[i]]);
                        }
                        var chartInfo = {
                            title: req.params.symbol,
                            data: graphData
                        };
                        res.json(chartInfo);
                    }else{
                        res.json({error: "error"});
                    }
                }
            });
    };
    
    this.getMyGraph = function(req, res){
        var params = {
            NumberOfDays: 365,
            DataPeriod: "Day",
            Elements:[]
        };
        var syms = JSON.parse(req.params.symbols);
        for(var i in syms){
            params.Elements.push({
                Symbol: syms[i],
                Type: "price",
                Params: ["c"]
            });
        }
        var stockHistoryUrl = process.env.MOD_HISTORY_URI;
        stockHistoryUrl += "?parameters=" + JSON.stringify(params);
        request(stockHistoryUrl, function(err, response, body) {
            if(!err && response.statusCode == 200){
                var results = JSON.parse(body);
                if(results.Elements){
                    var elements = [];
                    for(var i=0; i<results.Elements.length; i++){
                        var tempData = [];
                        for(var j=0; j<results.Dates.length; j++){
                            tempData.push([
                                Date.parse(results.Dates[j]),
                                results.Elements[i].DataSeries.close.values[j]
                            ]);
                        }
                        elements.push({
                            name: results.Elements[i].Symbol,
                            data: tempData
                        });
                    }
                    res.json(elements);
                }else{
                    res.json({error:"error"});
                }
            }
        });
    };
}

module.exports = GraphHandler;