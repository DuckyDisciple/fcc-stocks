"use strict";

(function(){
    var displayName = document.querySelector("#profile-display") || null;
    var signedInDiv = document.querySelector(".signed-in") || null;
    var notSignedInDiv = document.querySelector(".not-signed-in") || null;
    
    var checkInButton = document.querySelector(".me-too") || null;
    var checkOutButton = document.querySelector(".nah") || null;
    var userUL = document.querySelector(".going-list") || null;
    
    // var displayName = document.querySelector("#profile-display") || null;
    
    // var apiUrlGit = appUrl + '/api/git/:id';
    var apiUrl = appUrl + '/api/:id';
    var checkInUrl = appUrl + '/api/checkIn/:id/:name';
    var checkOutUrl = appUrl + '/api/checkOut/:id';
    var placesUrl = appUrl + '/api/places';
    
    function updateHtmlElement(data, element, userProperty){
        if(userProperty==="displayName"){
            var fullName = data[userProperty];
            var firstName = fullName.substring(0,fullName.lastIndexOf(' '));
        }
        element.innerHTML = firstName;
    }
    
    function updatePlacesList(userList,element){
        for(var i=0; i< userList.length; i++){
            var item = document.createElement("li");
            item.innerHTML=userList[i][userProperty];
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
            signedInDiv.className = signedInDiv.className.replace(/\bhide\b/g,'');
            notSignedInDiv.classList.add("hide");
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
    
    checkInButton.addEventListener("click",function(){
        ajaxFunctions.ajaxRequest("POST",checkInUrl,function(){
            ajaxFunctions.ajaxRequest("GET",placesUrl,function(data) {
                updatePlacesList(data, userUL);
            });
        });
        
    });
    
})();