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
                    var graphData = [];
                    for(var i=0; i<results.Dates.length; i++){
                        graphData.push([Date.parse(results.Dates[i]), results.Elements[0].DataSeries.close.values[i]]);
                    }
                    var chartInfo = {
                        title: req.params.symbol,
                        data: graphData
                    };
                    res.json(chartInfo);
                }
            });
    };
}

module.exports = GraphHandler;