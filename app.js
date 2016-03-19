
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , login = require('./routes/login')
  , tweet = require('./routes/tweet')
  , hash = require('./routes/hash');

var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var app = express();


var options = {
		host     : 'localhost', //host where mysql server is running     
		user     : 'root', //user for the mysql application     
		password : '', //password for the mysql application     
		database : 'twitter', //database name     
		port  : 3306, //port, it is 3306 by default for mysql
	    checkExpirationInterval: 900000,// How frequently expired sessions will be cleared; milliseconds.
	    expiration: 86400000,// The maximum age of a valid session; milliseconds.
	    createDatabaseTable: true,// Whether or not to create the sessions database table, if one does not already exist.
	    schema: {
	        tableName: 'sessions',
	        columnNames: {
	            session_id: 'session_id',
	            expires: 'expires',
	            data: 'data'
	        }
	    }
	};


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//SETTING UP MYSQL-SESSION
var connection = mysql.createConnection(options);
var sessionStore = new MySQLStore({}, connection);

//SETTING UP SESSION
app.use(session({
	key: 'session_cookie_aashay',
    secret: 'aashay',
    resave: true,
    saveUninitialized: true,
    proxy: true,
    store: sessionStore,
    cookie: {}
}));


app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}



//GET REQUEST
app.get('/', routes.index);
app.get('/users', user.list);

//GET ALL THE TWEET THAT HAS HASHTAG OF :TAG
app.get('/hashtag/:tag', hash.page);

//USER PROFILE FROM ID
app.get('/user/:id',user.profile)

//POST REQUEST

//To register user
app.post('/reg', login.registerUser);
//To login user
app.post('/login', login.loginUser);
//To logout user
app.post('/logout', login.logOut);
//Insert tweet to db
app.post('/tweet', tweet.ins);
//Get recent tweet
app.post('/recenttweet', tweet.recentTweet);
//Delete tweet
app.post('/deletetweet', tweet.deleteTweet);
//Search suggestion
app.post('/suggest', tweet.suggest);
//Get Hash Tweet
app.post('/hashtweet', hash.hashtweet);
//Like and Dislike button
app.post('/like', tweet.like);
//Show all tweets of user by userid
app.post('/tweetbyuserid', tweet.tweetbyuserid);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
