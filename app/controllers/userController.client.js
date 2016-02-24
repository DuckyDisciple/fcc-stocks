"use strict";

(function(){
    var displayName = document.querySelector("#profile-display") || null;
    var loggedInDiv = document.querySelector(".logged-in") || null;
    var notLoggedInDiv = document.querySelector(".not-logged-in") || null;
    
    var watchButton = document.querySelector(".watch") || null;
    var unwatchButton = document.querySelector(".unwatch") || null;
    var userUL = document.querySelector(".watching-list") || null;
    var stockName = document.querySelector(".stock-name") || null;
    var stockSymbol = document.querySelector(".stock-symbol") || null;
    
    var myStocksUL = document.querySelector('.stocks-list') || null;
    
    // var displayName = document.querySelector("#profile-display") || null;
    
    // var apiUrlGit = appUrl + '/api/git/:id';
    var apiUrl = appUrl + '/api/:id';
    var watchUrl = appUrl + '/api/watch/';
    var unwatchUrl = appUrl + '/api/unwatch/';
    var watchListUrl = appUrl + '/api/watchlist';
    var userListUrl = appUrl + '/api/users/';
    var isWatchingApi = appUrl + '/api/watching/';
    
    function updateHtmlElement(data, element, userProperty){
        if(userProperty==="displayName"){
            var fullName = data[userProperty];
            var firstName = fullName.substring(0,fullName.lastIndexOf(' '));
        }
        if(element !== null)
            element.innerHTML = firstName;
    }
    
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
    
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest("GET",apiUrl,function(data){
        try{
            var userObject = JSON.parse(data);
        
            if(userObject.email!==undefined){
                loggedInDiv.className = loggedInDiv.className.replace(/\bhide\b/g,'');
                notLoggedInDiv.classList.add("hide");
            }
            
            if(displayName!==null){
                if(userObject.displayName!==undefined){
                    updateHtmlElement(userObject,displayName,'displayName');
                }else if(userObject.email!==undefined){
                    updateHtmlElement(userObject,displayName,'email');
                }
            }
        }catch(error){
            //not logged in
        }
    }));
    
    if(userUL !== null){
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest("GET",userListUrl+stockSymbol.innerHTML,function(data) {
            updateWatchersList(JSON.parse(data),userUL);
        }));
        
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest("GET",isWatchingApi+stockSymbol.innerHTML,function(data) {
            try{
                var userListed = JSON.parse(data).found;
                if(userListed){
                    unwatchButton.className = unwatchButton.className.replace(/\bhide\b/g,'');
                }else{
                    watchButton.className = watchButton.className.replace(/\bhide\b/g,'');
                }
            }catch(error){
                //not logged in
            }
        }));
    }
    
    // if(watchButton !== null){
    //     watchButton.addEventListener("click",function(){
    //         var mySymbol = stockSymbol.innerHTML;
    //         var myName = stockName.innerHTML;
    //         var postUrl = watchUrl + mySymbol + "/" + myName;
    //         ajaxFunctions.ajaxRequest("POST",postUrl,function(){
    //             ajaxFunctions.ajaxRequest("GET",userListUrl+mySymbol,function(data) {
    //                 updateWatchersList(JSON.parse(data), userUL);
    //                 watchButton.className += " hide";
    //                 unwatchButton.className = unwatchButton.className.replace(/\bhide\b/g,'');
    //             });
    //         });
            
    //     });
    // }
    // if(unwatchButton !== null){
    //     unwatchButton.addEventListener("click",function() {
    //         var mySymbol = stockSymbol.innerHTML;
    //         var delUrl = unwatchUrl + mySymbol;
    //         ajaxFunctions.ajaxRequest("DELETE",delUrl,function(){
    //             ajaxFunctions.ajaxRequest("GET",userListUrl+mySymbol,function(data) {
    //                 updateWatchersList(JSON.parse(data), userUL);
    //                 watchButton.className = watchButton.className.replace(/\bhide\b/g,'');
    //                 unwatchButton.className += " hide";
    //             });
    //         });
    //     });
    // }
    
    // if(myStocksUL !== null){
    //     ajaxFunctions.ready(ajaxFunctions.ajaxRequest("GET",watchListUrl,function(data) {
    //         var stocksData = JSON.parse(data);
    //         if(stocksData.length === 0){
    //             var empty = document.createElement("li");
    //             empty.innerHTML = "You aren't watching any stocks yet";
    //             myStocksUL.appendChild(empty);
    //         }else{
    //             for(var i=0; i< stocksData.length; i++){
    //                 var stockListing = document.createElement("li");
    //                 stockListing.className = "my-stock";
    //                 stockListing.setAttribute("id", stocksData[i].symbol);
    //                 stockListing.innerHTML = stocksData[i].name + " (" + stocksData[i].symbol + ")";
    //                 myStocksUL.appendChild(stockListing);
    //             }
    //         }
    //     }));
    // }
    
})();