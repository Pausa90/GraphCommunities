/** Init **/

window.fbAsyncInit = function() {
  FB.init({
    appId      : '235383066660077',
    status     : true,
    xfbml      : true
  });
  showButtonIfIsLogged();
};

(function(d, s, id){
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement(s); js.id = id;
 js.src = "https://connect.facebook.net/en_US/all.js";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk')); 

/**  **/

var FBgraph = {}
var apiCaller_count = 0;

function FB_login(){ 
  FB.login(function(response) {
    if (response.authResponse)
      console.log('login');
    else            
      console.log('Authorization failed.');
    showButton();
  },{scope: 'email'});
}

function showButton(){
  document.getElementById("logout_button").style.display='block';
  document.getElementById("createGraph_button").style.display='block';
}

function FB_logout(){  
  console.log("logout");
  FB.logout(function(){document.location.reload();});
}

function showButtonIfIsLogged(){
  FB.getLoginStatus(function(response) {
  if (response.status === 'connected' || response.status === 'not_authorized') 
    showButton();
 });
}

function getFriendList(person){
  return getFriendListAPI(person, "friends");
}

function getMutualFriendList(person){
  return getFriendListAPI(person, "mutualfriends");
}

function getFriendListAPI(person,method){
  var list = [];
  FB.api('/' + person + '/' + method, function(response) {
    if(response.data) {
      response.data.forEach(function(friend) {
        list.push({'name':friend.name, 'id:':friend.id});
      });
    } 
  });
  return list;
}

function addMyFriends(){
  var list = [];
  FB.api('/' + "me" + '/' + "friends", function(response) {
    if(response.data) {
      response.data.forEach(function(friend) {
        list.push({'name':friend.name, 'id':friend.id});
      });
      FBgraph["me"] = list;
      addFriendsOfMyFriends(list);
    } 
  });
}

function addFriendsOfMyFriends(friends){
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
        checkToDraw(friends.length,index);
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
            checkToDraw(friends.length,index);
          }
        });
      }
    });
  });
}

function createGraph(){
  addMyFriends();
}

function checkToDraw(){
  if (apiCaller_count === 0)
    drawGraph();
}

function drawGraph(){
  
  document.getElementById("facebook-friends").innerHTML = graphToString();
  renderGraph();
}

function graphToString(){
  var out = "{ <br/>";
  Object.keys(FBgraph).forEach(function(friend_id){
    out += getFriendName(friend_id) + ": [ ";
    FBgraph[friend_id].forEach(function (friend_obj){
      out += getFriendName(friend_obj.id) + " - ";
    });
    out += "];<br/>";
  });
  return out + "}";
}

function getFriendName(id){
  var friends = FBgraph["me"];
  for (var i=0; i<friends.length; i++){
    var friend = friends[i];
    if (friend.id === id)
      return friend.name;
  }
}