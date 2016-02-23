"use strict";

(function(){
    var singleGraph = document.querySelector(".stock-graph") || null;
    var watchedGraph = document.querySelector(".watched-graph") || null;
    
    var stockSymbol = document.querySelector(".stock-symbol") || null;
    
    // var Highcharts = require('highcharts/highstock');
    
    var chartApi = appUrl + '/api/graph/';
    
    function createGraph(title, data){
        if(singleGraph !== null){
            var chart = new Highcharts.StockChart({
                chart: {
                    renderTo: singleGraph
                },
                rangeSelector: {
                    selected: 1
                },
                title: {
                    text: title
                },
                plotOptions: {
                    series: {
                        turboThreshold: 0
                    }
                },
                series: [{
                    name: 'Close',
                    data: data
                }]
            });
        }
    }
    
    if(stockSymbol !== null){
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', chartApi + stockSymbol.innerHTML, function(data){
            var info = JSON.parse(data);
            createGraph(info.title, info.data);
        }));
    }
})();