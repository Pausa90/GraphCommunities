/** Init **/

(function() {
  var po = document.createElement('script');
  po.type = 'text/javascript'; 
  po.async = true;
  po.src = 'https://plus.google.com/js/client:plusone.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(po, s);
})();

/** Variabili Globali **/

var Ggraph = {}
var GapiCaller_count = 0;
var access_token;

function GAPI_load(){
  gapi.client.setApiKey('AIzaSyCfDaNq9XEjfQicXZV02kzADOzpOics3xM'); //set your API KEY
  gapi.client.load('plus', 'v1',function(){});//Load Google + API
}

function G_login(authResult){
  if (authResult['access_token']) {
    // Autorizzazione riuscita
    // Nascondi il pulsante di accesso ora che l'utente è autorizzato. Ad esempio: 
    access_token = authResult['access_token'];
    showGButton();
    GAPI_load();
  } else if (authResult['error']) {
    // Si è verificato un errore.
    // Possibili codici di errore:
    //   "access_denied" - L'utente ha negato l'accesso alla tua app
    //   "immediate_failed" - Impossibile eseguire l'accesso automatico dell'utente
    console.log('There was an error: ' + authResult['error']);
  }
}

function showGButton(){
  document.getElementById("google_login_button").style.display='none';
  document.getElementById("google_logout_button").style.display='block';
  document.getElementById("createGGraph_button").style.display='block';
}

function G_logout(){
  var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' +
      access_token;

  // Esecuzione di una richiesta GET asincrona.
  $.ajax({
    type: 'GET',
    url: revokeUrl,
    contentType: "application/json",
    dataType: 'jsonp',
    success: function(nullResponse) {
      // Esegui un'azione, l'utente è disconnesso
      // La risposta è sempre indefinita.
      location.reload();
    },
    error: function(e) {
      // Gestione dell'errore
      // console.log(e);
      // Puoi indirizzare gli utenti alla disconnessione manuale in caso di esito negativo
      // https://plus.google.com/apps
      alert('Impossibile uscire');
    }
  });
}


function createGGraph(){
  addMyGFriends();
}

function addMyGFriends(){
  var list = [];
  var request = gapi.client.plus.people.list({ 'userId':'me', 'collection':'visible' });
  request.execute(function(resp){
    resp['items'].forEach(function(friend){
      list.push({'name':friend.displayName, 'id':friend.id, 'url':friend.url});
    });
    Ggraph['me'] = list;
    //addGFriendsOfMyFriends(list);
    // drawGraph();
    getValeriosFriends();
  });
}

function addGFriendsOfMyFriends(friends){
  friends.forEach(function(friend, index){
    GapiCaller_count++;
    var request = gapi.client.plus.people.list({ 'userId':friend.id, 'collection':'visible' });
    request.execute(function(resp){
      GapiCaller_count--;
      var list = [];
      if (resp['items'])
        resp['items'].forEach(function(friend){
          list.push({'name':friend.displayName, 'id':friend.id});
        });
      else
        console.log(resp['message'])
      Ggraph[friend.id] = list;
      checkToDrawG();
    });  
  });  
}

function getValeriosFriends(){
  idValerio=117246951523158448063;
  var request = gapi.client.plus.people.list({ 'userId':idValerio, 'collection':'visible' });
  request.execute(function(resp){
    if (resp['items'])
      resp['items'].forEach(function(friend){
          list.push({'name':friend.displayName, 'id':friend.id});
        });
    else
      list.push('Non funziona, errore: ' + resp['message']);
    Ggraph[friend.id] = list;
    checkToDrawG();
  });
}

function checkToDrawG(){
  console.log(GapiCaller_count);
  if (GapiCaller_count === 0)
    drawGGraph();
}


function drawGGraph(){  
  document.getElementById("g+-friends").innerHTML = ggraphToString();
}

function ggraphToString(){
  var out = "{ <br/>";
  Object.keys(Ggraph).forEach(function(friend_id){
    // if (friend_id != "me"){
    //   out += getFriendName("me", friend_id) + ": [ ";
    //   Ggraph[friend_id].forEach(function (friend_obj){
    //     out += getFriendName(friend_id, friend_obj.id) + " - ";
    //   });
    //   out += "];<br/>";
    // }
    out += friend_id + ": [ ";
    Ggraph[friend_id].forEach(function (friend_obj){
      out += "(" + friend_obj.name + " - " + friend_obj.id + ") - ";
    });
    out += " ]</br>"
  });
  return out + "</br>}";
}

// function getFriendName(id_list, id_toFound){
//   var friends = FBgraph[id_list];
//   for (var i=0; i<friends.length; i++){
//     var friend = friends[i];
//     if (friend.id === id_toFound)
//       return friend.name;
//   }