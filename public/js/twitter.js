/** init **/
window.twttr = (function (d, s, id) {
  var t, js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id; js.src= "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);
  return window.twttr || (t = { _e: [], ready: function (f) { t._e.push(f) } });
}(document, "script", "twitter-wjs"));

/** Variabili Globali **/

var TGraph = [];
var TapiCaller_count = 0;

function Tw_login(){
	$.get("/sessions/callback/", function(){
        $.post("/getUser/", {'id':'51434415'}, function(valerio){
            console.log(valerio);
        })
    })
}

function Tw_logout(){
	console.log("logout di twitter da implementare");
}

function createTwGraph(){
	twitterQuery("https://api.twitter.com/1.1/friends/list.json", addMyTFriends)
}

function addMyTFriends(response){
	var list = [];
	if(response['user'])
		response['users'].forEach(function(friend){
			list.push({'name':friend.displayName, 'id':friend.id});
		});
	else
		list.push("errore: " + response['error']);
	TGraph['me'] = list;
	drawTGraph();
}

function drawTGraph(){
	twttr.widgets.load(newArticleElement);
	document.body.replaceNode(newArticleElement, oldArticleElement);
	console.log('disegnato?');
}

function twitterQuery(query, callback){
	$.ajax({
	    type: 'GET',
	    url: query,
	    contentType: "application/json",
	    dataType: 'json',
	    success: callback,
	    error: function(e) {
	      console.log('Errore nella query: ' + query + "errore: " + e);
	    }
	});
}
