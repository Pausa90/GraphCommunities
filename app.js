
/**
 * Module dependencies.
 */

var express = require('express'),
   http = require('http'),
   path = require('path'),
   OAuth = require('oauth').OAuth,
   qs = require('qs'),
   util = require('util'),
   passport = require('passport'),
   LocalStrategy = require('passport-local').Strategy,
   GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var app = express();

app.configure(function(){
  // all environments
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.set('port', 3000);
  app.engine('html', require('hbs').__express);
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(express.static(__dirname + '/public'));
  app.use(passport.initialize());
  app.use(passport.session());

});

// API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
var GOOGLE_CLIENT_ID = "85474813662.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "K382OzW8zmw_5VS9WpenZ_50";

////////////////PASSPORT
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

//////
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


/////////////////////////
//Passport Google OAuth 2.0

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
      //User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //  return done(err, user);
      //});
    });
  }
));




  


app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

////////ENSURE AUTHENTICATED//////////
// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}



/////////////////



/////////////////////////////////////////////////////////////////
/////////////////////END PASSPORT GOOGLE/////////////////////////
/////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////
//////////////////////PASSPORT TWITTER///////////////////////////
/////////////////////////////////////////////////////////////////







/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//ROUTES
// app.get('/', function(req, res, next){
//   res.render("index");
  
// } );

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