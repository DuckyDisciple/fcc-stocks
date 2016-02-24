"use strict";

(function(){
    var singleGraph = document.querySelector(".stock-graph") || null;
    var watchedGraph = document.querySelector(".watched-graph") || null;
    
    var stockSymbol = document.querySelector(".stock-symbol") || null;
    var stockSymbols = document.querySelectorAll(".my-stock");
    
    // var Highcharts = require('highcharts/highstock');
    
    var graphApi = appUrl + '/api/graph/';
    var myGraphApi = appUrl + '/api/my/';
    
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
    
    function createMyGraph(elements){
        if(watchedGraph !== null){
            if(elements.hasOwnProperty("error")){
                watchedGraph.innerHTML="Error loading graph";
            }else{
                var seriesData = [];
                for(var i in elements){
                    seriesData.push({
                        name: elements[i].name,
                        data: elements[i].data
                    });
                }
                
                var graph = new Highcharts.StockChart({
                    chart: {
                        renderTo: watchedGraph
                    },
                    rangeSelector: {
                        selected: 1
                    },
                    title: {
                        text: "My watched stocks"
                    },
                    plotOptions: {
                        series: {
                            turboThreshold: 0
                        }
                    },
                    series: seriesData
                });
            }
        }
    }
    
    if(stockSymbol !== null){
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', graphApi + stockSymbol.innerHTML, function(data){
            var info = JSON.parse(data);
            if(info.hasOwnProperty("error")){
                singleGraph.innerHTML="Error loading graph";
            }else{
                createGraph(info.title, info.data);
            }
        }));
    }
    
    if(stockSymbols.length > 0){
        var symbols = [];
        for(var i=0; i<stockSymbols.length; i++){
            symbols.push(stockSymbols[i].getAttribute("id"));
        }
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', myGraphApi + JSON.stringify(symbols), function(data){
            createMyGraph(JSON.parse(data));
        }));
    }
})();