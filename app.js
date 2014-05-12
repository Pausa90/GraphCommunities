
/**
 * Module dependencies.
 */

var express = require('express'),
   http = require('http'),
   path = require('path'),
   OAuth = require('oauth').OAuth,
   qs = require('qs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
// app.use(express.favicon());
//app.use(express.logger('dev'));
//app.use(express.bodyParser());
//app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//ROUTES
app.get('/', function(req, res, next){
  res.render("index");
  
} );

var config = {
    "consumerKey": "{jSdxNNIw0GPVkmqojIN59a5of}",
    "consumerSecret": "{xIOwTrLfwBcXWasTPbhlvT5Pm2bzHWvXa9cYhTChmt6NbxGxH1}",
    "accessToken": "{51434415-LdYxxVQdQ38a9oTJoLy3SnfNk8qPO0BpgdvxdrU6K}",
    "accessTokenSecret": "{2nRFMQacREJeOR82WKSV3zx1zkVq5JrNNOyBJO8nHjB4x}",
    "callBackUrl": "{http://localhost:3000}"
};

var Twitter = require('./lib/Twitter').Twitter;
var twitter;

var error = function (err, response) {
    console.log("error function \n" + JSON.stringify(err));
};

var success = function (data) {
    console.log('{data:[%s]}', data);
};


app.get('/twitterLogin/', function(req, res, next){
	twitter = new Twitter(config);
	res.send("logged");
});

app.get('/logged/', function(req, res, next){
  app.get()
});

app.post('/getUser/', function(req, res,next){
	twitter.getUser(req['id'], error, success);
});

app.get('/sessions/callback', function(req, res){
  sys.puts(">>"+req.session.oauthRequestToken);
  sys.puts(">>"+req.session.oauthRequestTokenSecret);
  sys.puts(">>"+req.query.oauth_verifier);
  consumer().getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
    if (error) {
      res.send("Error getting OAuth access token : " + sys.inspect(error) + "["+oauthAccessToken+"]"+ "["+oauthAccessTokenSecret+"]"+ "["+sys.inspect(results)+"]", 500);
    } else {
      req.session.oauthAccessToken = oauthAccessToken;
      req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
      // Right here is where we would write out some nice user stuff
      consumer.get("http://twitter.com/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response) {
        if (error) {
          res.send("Error getting twitter screen name : " + sys.inspect(error), 500);
        } else {
          req.session.twitterScreenName = data["screen_name"];    
          res.send('You are signed in: ' + req.session.twitterScreenName)
        }  
      });  
    }
  });
});

var https = require('https');

app.get('/googlePlusFriendsOfFriends/', function(req, res, next){
//GET https://www.googleapis.com/plus/v1/people/me/people/visible?key={YOUR_API_KEY}
  var getString="www.googleapis.com/plus/v1/people/";
  var idValerio="117246951523158448063";
  var serverAPIKEY="AIzaSyDL9nOHwDF0F1lovx2MJ08Ge2kepQ9MVqY";
  getString+=idValerio + "/people/visible?key=" + serverAPIKEY;

  https.get(getString, function(res){
    console.log(JSON.stringify(res));
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
}); 