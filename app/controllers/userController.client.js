"use strict";

(function(){
    var displayName = document.querySelector("#profile-display") || null;
    var loggedInDiv = document.querySelector(".logged-in") || null;
    var notLoggedInDiv = document.querySelector(".not-logged-in") || null;
    
    var checkInButton = document.querySelector(".me-too") || null;
    var checkOutButton = document.querySelector(".nah") || null;
    var userUL = document.querySelector(".going-list") || null;
    var barTitle = document.querySelector(".bar-name") || null;
    var barId = document.querySelector(".bar-id") || null;
    
    var myPlacesUL = document.querySelector('.places-list') || null;
    
    // var displayName = document.querySelector("#profile-display") || null;
    
    // var apiUrlGit = appUrl + '/api/git/:id';
    var apiUrl = appUrl + '/api/:id';
    var checkInUrl = appUrl + '/api/checkIn/';
    var checkOutUrl = appUrl + '/api/checkOut/';
    var placesUrl = appUrl + '/api/places';
    var userListUrl = appUrl + '/api/users/';
    var isGoingApi = appUrl + '/api/going/';
    
    function updateHtmlElement(data, element, userProperty){
        if(userProperty==="displayName"){
            var fullName = data[userProperty];
            var firstName = fullName.substring(0,fullName.lastIndexOf(' '));
        }
        if(element !== null)
            element.innerHTML = firstName;
    }
    
    function updatePlacesList(userList,element){
        while(element.firstChild){
            element.removeChild(element.firstChild);
        }
        if(userList.length === 0){
            var nobody = document.createElement("li");
            nobody.innerHTML = "Nobody is going here yet";
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
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest("GET",userListUrl+barId.innerHTML,function(data) {
            updatePlacesList(JSON.parse(data),userUL);
        }));
        
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest("GET",isGoingApi+barId.innerHTML,function(data) {
            try{
                var userListed = JSON.parse(data).found;
                if(userListed){
                    checkOutButton.className = checkOutButton.className.replace(/\bhide\b/g,'');
                }else{
                    checkInButton.className = checkInButton.className.replace(/\bhide\b/g,'');
                }
            }catch(error){
                //not logged in
            }
        }));
    }
    
    if(checkInButton !== null){
        checkInButton.addEventListener("click",function(){
            var myId = barId.innerHTML;
            var myName = barTitle.innerHTML;
            var postUrl = checkInUrl + myId + "/" + myName;
            ajaxFunctions.ajaxRequest("POST",postUrl,function(){
                ajaxFunctions.ajaxRequest("GET",userListUrl+myId,function(data) {
                    updatePlacesList(JSON.parse(data), userUL);
                    checkInButton.className += " hide";
                    checkOutButton.className = checkOutButton.className.replace(/\bhide\b/g,'');
                });
            });
            
        });
    }
    if(checkOutButton !== null){
        checkOutButton.addEventListener("click",function() {
            var myId = barId.innerHTML;
            var delUrl = checkOutUrl + myId;
            ajaxFunctions.ajaxRequest("DELETE",delUrl,function(){
                ajaxFunctions.ajaxRequest("GET",userListUrl+myId,function(data) {
                    updatePlacesList(JSON.parse(data), userUL);
                    checkInButton.className = checkInButton.className.replace(/\bhide\b/g,'');
                    checkOutButton.className += " hide";
                })
            })
        })
    }
    
    if(myPlacesUL !== null){
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest("GET",placesUrl,function(data) {
            var placesData = JSON.parse(data);
            if(placesData.length === 0){
                var nobody = document.createElement("li");
                nobody.innerHTML = "You haven't checked-in anywhere yet";
                myPlacesUL.appendChild(nobody);
            }else{
                for(var i=0; i< placesData.length; i++){
                    var placeLink = document.createElement("a");
                    placeLink.className = "my-place-link";
                    placeLink.setAttribute("href",appUrl+"/bar/"+placesData[i].id);
                    placeLink.innerHTML = placesData[i].name;
                    var placeListing = document.createElement("li");
                    placeListing.appendChild(placeLink);
                    myPlacesUL.appendChild(placeListing);
                }
            }
        }));
    }
    
})();