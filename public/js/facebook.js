/** Init **/

window.fbAsyncInit = function() {
  FB.init({
    appId      : '235383066660077',
    status     : true,
    xfbml      : true
  });
  showFBButtonIfIsLogged();
};

(function(d, s, id){
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement(s); js.id = id;
 js.src = "https://connect.facebook.net/en_US/all.js";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk')); 



/** Variabili Globali **/

var FBgraph = {}
var apiCaller_count = 0;

//Funzione che effettua il login e mostra i pulsanti una volta effettuato
function FB_login(){ 
  FB.login(function(response) {
    if (response.authResponse){
      showFBButton();
    }
    else            
      console.log('Authorization failed.');    
  },{scope: 'email'});
}

//Preleva i pulsanti dall'html e li rende visibili
function showFBButton(){
  document.getElementById("facebook_login_button").style.display='none';
  document.getElementById("facebook_logout_button").style.display='block';
  document.getElementById("createFBGraph_button").style.display='block';
}

//FUnzione che permette il logout
function FB_logout(){  
  FB.logout(function(){document.location.reload();});
}

//Controlla se si è loggati al caricamento ed in caso positivo mostra i pulsanti
function showFBButtonIfIsLogged(){
  FB.getLoginStatus(function(response) {
  if (response.status === 'connected' || response.status === 'not_authorized') 
    showFBButton();
 });
}

/**Possono essere utili, ma non sono usate
* function getFriendList(person){
*   return getFriendListAPI(person, "friends");
** }
** function getMutualFriendList(person){
**   return getFriendListAPI(person, "mutualfriends");
** }
** function getFriendListAPI(person,method){
**   var list = [];
**   FB.api('/' + person + '/' + method, function(response) {
**     if(response.data) {
**       response.data.forEach(function(friend) {
**         list.push({'name':friend.name, 'id:':friend.id});
**       });
**     } 
**   });
**   return list;
** }
**/

function addMyFBFriends(){
  var list = [];
  FB.api('/' + "me" + '/' + "friends", function(response) {
    if(response.data) {
      response.data.forEach(function(friend) {
        list.push({'name':friend.name, 'id':friend.id});
      });
      FBgraph["me"] = list;
      addFBFriendsOfMyFriends(list);
    } 
  });
}

function addFBFriendsOfMyFriends(friends){
  friends.forEach(function(friend, index){
    apiCaller_count++;
    FB.api('/' + friend.id + '/' + "friends", function(response) {
      apiCaller_count--;
      if(response.data) {
        console.log("amici di " + friend.name + " arrivati");
        var list = [];
        response.data.forEach(function(friend) {
          list.push({'name':friend.name, 'id':friend.id});
        });
        FBgraph[friend.id] = list;
        checkToDrawFB(friends.length,index);
      } else if (response.error) {
        apiCaller_count++;
        FB.api('/' + friend.id + '/' + "mutualfriends", function(response) {
          apiCaller_count--;
          if(response.data) {
            console.log("amici in comune con " + friend.name + " arrivati");
            var list = [];
            response.data.forEach(function(friend) {
              list.push({'name':friend.name, 'id':friend.id});
            });
            FBgraph[friend.id] = list;
            checkToDrawFB(friends.length,index);
          }
        });
      }
    });
  });
}

function createFBGraph(){
  addMyFBFriends();
}

function checkToDrawFB(){
  if (apiCaller_count === 0)
    drawFBGraph();
}

function drawFBGraph(){
  
  document.getElementById("facebook-friends").innerHTML = fbgraphToString();
  // renderGraph();
}

function fbgraphToString(){
  var out = "{ <br/>";
  Object.keys(FBgraph).forEach(function(friend_id){
    if (friend_id != "me"){
      out += getFriendName("me", friend_id) + ": [ ";
      FBgraph[friend_id].forEach(function (friend_obj){
        out += getFriendName(friend_id, friend_obj.id) + " - ";
      });
      out += "];<br/>";
    }
  });
  return out + "}";
}

function getFriendName(id_list, id_toFound){
  var friends = FBgraph[id_list];
  for (var i=0; i<friends.length; i++){
    var friend = friends[i];
    if (friend.id === id_toFound)
      return friend.name;
  }
}