var express = require('express');
var http = require('http');
var path = require('path');
var https = require('https');

var CLIENTID = "1529439650665863";
var CLIENTSECRET = "58c3d2565cd2423fa0aeab778f1fffe4";



var passport = require('passport')
, FacebookStrategy = require('passport-facebook').Strategy;
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());

app.use(passport.initialize()); 
app.use(passport.session()); 
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

passport.use(new FacebookStrategy({
    clientID: CLIENTID, 
    clientSecret: CLIENTSECRET,
    callbackURL: "http://localhost:3000/oauth/callback"
},function(accessToken, refreshToken, profile, done){
    passport.session.accessToken = accessToken; 
    process.nextTick(function(){
        done(null ,profile);
    });
}));

passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(obj, done){
    done(null, obj);
});

app.get('/oauth', passport.authenticate('facebook'));
app.get('/oauth/callback',passport.authenticate('facebook',{failureRedirect: '/fail'}),function(req, res) {
    res.redirect('/');
});
app.get('/', function(req,res,next){
    if (!passport.session.accessToken){
        res.redirect("/oauth")
    }else{
        next();
    }
},function(req, res,next){
api_path = '/me?access_token='+passport.session.accessToken;
    var data = "";
    var nickname;
    var api_req = https.request({host:'graph.facebook.com', path: api_path, method:'GET'}, function(api_res){
        api_res.setEncoding('utf8');
        api_res.on('data',function(d){
            data += d;
        });
        api_res.on('end', function(){
            nickname = JSON.parse(data);
          console.log(nickname['first_name']);            
        });
    });
    api_req.end();
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
