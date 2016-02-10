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
    
    // var displayName = document.querySelector("#profile-display") || null;
    
    // var apiUrlGit = appUrl + '/api/git/:id';
    var apiUrl = appUrl + '/api/:id';
    var checkInUrl = appUrl + '/api/checkIn/';
    var checkOutUrl = appUrl + '/api/checkOut/';
    var placesUrl = appUrl + '/api/places';
    var userListUrl = appUrl + '/api/users/';
    
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
        for(var i=0; i< userList.length; i++){
            var item = document.createElement("li");
            item.innerHTML=userList[i];
            element.appendChild(item);
        }
    }
    
    // ajaxFunctions.ready(ajaxFunctions.ajaxRequest("GET",apiUrlGit,function(data){
    //     var userObject = JSON.parse(data);
        
    //     if(userObject.username!==undefined){
    //         if(divGit!==null) divGit.className = "profile";
    //     }
        
    //     if(displayName!==null){
    //         if(userObject.displayName!==undefined){
    //             updateHtmlElement(userObject,displayName,'displayName');
    //         }else if(userObject.username!==undefined){
    //             updateHtmlElement(userObject,displayName,'username');
    //         }
    //     }
        
    //     if(profileIdGit!==null){
    //         updateHtmlElement(userObject,profileIdGit,'id');
    //     }
    //     if(displayNameGit!==null){
    //         updateHtmlElement(userObject,displayNameGit,'displayName');
    //     }
    //     if(usernameGit!==null){
    //         updateHtmlElement(userObject,usernameGit,'username');
    //     }
    //     if(publicReposGit!==null){
    //         updateHtmlElement(userObject,publicReposGit,'publicRepos');
    //     }
    // }));
    
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest("GET",apiUrl,function(data){
        var userObject = JSON.parse(data);
        
        if(userObject.email!==undefined){
            // if(divG!==null) divG.className = "profile";
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
        
        // if(profileIdG!==null){
        //     updateHtmlElement(userObject,profileIdG,'id');
        // }
        // if(emailG!==null){
        //     updateHtmlElement(userObject,emailG,'email');
        // }
        // if(displayNameG!==null){
        //     updateHtmlElement(userObject,displayNameG,'displayName');
        // }
    }));
    
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
    
})();