/** init **/
window.twttr = (function (d, s, id) {
  var t, js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id; js.src= "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);
  return window.twttr || (t = { _e: [], ready: function (f) { t._e.push(f) } });
}(document, "script", "twitter-wjs"));

// var OAuth2 = OAuth.OAuth2;    
//  var twitterConsumerKey = 'jSdxNNIw0GPVkmqojIN59a5of';
//  var twitterConsumerSecret = 'xIOwTrLfwBcXWasTPbhlvT5Pm2bzHWvXa9cYhTChmt6NbxGxH1';
//  var oauth2 = new OAuth2(
//    twitterconsumerKey,
//    twitterConsumerSecret, 
//    'https://api.twitter.com/', 
//    null,
//    'oauth2/token', 
//    null);
//  oauth2.getOAuthAccessToken(
//    '',
//    {'grant_type':'client_credentials'},
//    function (e, access_token, refresh_token, results){
//      console.log('bearer: ',access_token);
//      oauth2.get('protected url', 
//        access_token, function(e,data,res) {
//          if (e) return callback(e, null);
//          if (res.statusCode!=200) 
//            return callback(new Error(
//              'OAuth2 request failed: '+
//              res.statusCode),null);
//          try {
//            data = JSON.parse(data);        
//          }
//          catch (e){
//            return callback(e, null);
//          }
//          return callback(e, data);
//       });
//    });

/** Variabili Globali **/

function Tw_login(){
	console.log("login di twitter da implementare");
}

function Tw_login(){
	console.log("logout di twitter da implementare");
}

function createTwGraph(){
	console.log("grafo di twitter da implementare");
}
