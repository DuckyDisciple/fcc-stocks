var stockName = document.querySelector(".stock-name") || null;
var stockSymbol = document.querySelector(".stock-symbol") || null;

var watchUrl = appUrl + '/api/watch/';
var unwatchUrl = appUrl + '/api/unwatch/';

var socket = io();
$(".watch").click(function(){
    var mySymbol = stockSymbol.innerHTML;
    var myName = stockName.innerHTML;
    var postUrl = watchUrl + mySymbol + "/" + myName;
    ajaxFunctions.ajaxRequest("POST",postUrl,function(){
        socket.emit("watch","added");
        $(".watch").addClass("hide");
        $(".unwatch").removeClass("hide");
    });
});

$(".unwatch").click(function(){
    var mySymbol = stockSymbol.innerHTML;
    var delUrl = unwatchUrl + mySymbol;
    ajaxFunctions.ajaxRequest("DELETE",delUrl,function(){
        socket.emit("unwatch","removed");
        $(".watch").removeClass("hide");
        $(".unwatch").addClass("hide");
    });
});