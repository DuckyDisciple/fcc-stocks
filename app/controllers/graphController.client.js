"use strict";

(function(){
    var singleGraph = document.querySelector(".stock-graph") || null;
    var recentsGraph = document.querySelector(".recents-graph") || null;
    
    var Highcharts = require('highcharts/highstock');
    
    var chartUri = process.env.MOD_HISTORY_URI;
    
    function createGraph(data){
        if(singleGraph !== null){
            var chart = new Highcharts.StockChart({
                chart: {
                    renderTo: singleGraph
                },
                rangeSelector: {
                    selected: 1
                },
                series: [{
                    name: 'Stock Graph',
                    data: data
                }]
            });
        }
    }
    
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', chartUri, function(data){
        createGraph(data);
    }));
})();