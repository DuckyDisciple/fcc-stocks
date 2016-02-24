var stockName = document.querySelector(".stock-name") || null;
var stockSymbol = document.querySelector(".stock-symbol") || null;
var userUL = document.querySelector(".watching-list") || null;

var watchUrl = appUrl + '/api/watch/';
var unwatchUrl = appUrl + '/api/unwatch/';
var userListUrl = appUrl + '/api/users/';

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

socket.on("update",function(msg){
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest("GET",userListUrl+stockSymbol.innerHTML,function(data) {
            updateWatchersList(JSON.parse(data),userUL);
        })); 
});

function updateWatchersList(userList,element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
    if(userList.length === 0){
        var nobody = document.createElement("li");
        nobody.innerHTML = "Nobody is watching this yet";
        element.appendChild(nobody);
    }else{
        for(var i=0; i< userList.length; i++){
            var item = document.createElement("li");
            item.innerHTML=userList[i];
            element.appendChild(item);
        }
    }
}