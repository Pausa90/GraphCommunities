/** Init **/

window.fbAsyncInit = function() {
  FB.init({
    appId      : '235383066660077',
    status     : true,
    xfbml      : true
  });
};

(function(d, s, id){
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement(s); js.id = id;
 js.src = "https://connect.facebook.net/en_US/all.js";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk')); 

/**  **/

var graph = {}
var apiCaller_count = 0;

function login(){ 
  FB.login(function(response) {
    if (response.authResponse)
      createGraph;
    else            
      console.log('Authorization failed.');
  },{scope: 'email'});
}

function logout(){  
  console.log("logout");
  FB.logout(function(){document.location.reload();});
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
    console.log("risposta arrivata")
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
      graph["me"] = list;
      console.log("aggiunti i miei amici")
      addFriendsOfMyFriends(list);
    } 
  });
}

function addFriendsOfMyFriends(friends){
  friends.forEach(function(friend, index){
    console.log("richiedo gli amici di " + friend.name);
    apiCaller_count++;
    FB.api('/' + friend.id + '/' + "mutualfriends", function(response) {
      apiCaller_count--;
      if(response.data) {
        console.log("amici di " + friend.name + " arrivati");
        var list = [];
        response.data.forEach(function(friend) {
          list.push({'name':friend.name, 'id':friend.id});
        });
        graph[friend.id] = list;
        console.log("aggiunti gli amici di " + friend.name);
        checkToDraw(friends.length,index);
      // } else if (response.error) {
      //     FB.api('/' + friend.id + '/' + "mutualfriends", function(response) {
      //       if(response.data) {
      //         var list = [];
      //         response.data.forEach(function(friend) {
      //           list.push({'name':friend.name, 'id:':friend.id});
      //         });
      //         graph[friend.id] = list;
      //         console.log("aggiunti gli amici in comune con " + friend.name);
      //         checkToDraw(friends.length,index);
      //       } 
      //     });
      }
    });
  });
}

function createGraph(){
  addMyFriends();
}

// function checkToDraw(size, index){
//   console.log(size-1 + " === " + index);
//   if (size-1 === index)
//     drawGraph();
// }
function checkToDraw(){
  console.log("apiCaller_count=" + apiCaller_count);
  if (apiCaller_count === 0)
    drawGraph();
}

function drawGraph(){
  
  document.getElementById("facebook-friends").innerHTML = graphToString();
  console.log(graph);
}

function graphToString(){
  var out = "{ <br/>";
  Object.keys(graph).forEach(function(friend_id){
    out += getFriendName(friend_id) + ": [\t";
    graph[friend_id].forEach(function (friend_obj){
      out += getFriendName(friend_obj.id) + "\t";
    });
    out += "];<br/>";
  });
  return out + "}";
}

function getFriendName(id){
  var friends = graph["me"];
  for (var i=0; i<friends.length; i++){
    var friend = friends[i];
    if (friend.id === id)
      return friend.name;
  }
}