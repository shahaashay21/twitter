var Sequelize = require('sequelize');
var db = require('./datamodel');
var user = require('./user');

exports.page = function(req,res){
	console.log("Class hash and function page");
	if(req.session.uid){
		user.userInfo(req.session.uid, function(userinfo){
	//		console.log(req.params.tag);
			userinfo['hashSearch'] = req.params.tag;
//			console.log(userinfo);
			res.render('hashtag', userinfo);
		});
	}else{
		res.render('index', { title: 'Express' });
	}
}

exports.hashtweet = function(req,res){
	console.log("Class hash and function hashtweet");
	var tag = req.param('q');
	console.log(tag);
	db.Hashtag.findAll({where: {'hashtag': tag}, attributes: [Sequelize.literal('DISTINCT tweet_id'), 'tweet_id'], raw:true}).then(function(tweet_id){
		var tweet_id = tweet_id.map(function(tweet_id) {
		    return tweet_id['tweet_id'];
		});
		console.log(tweet_id);
		db.Tweet.belongsTo(db.Users, {foreignKey:'user_id'});
		db.Tweet.findAll({where: {'id': {$in: tweet_id}}, limit: 10, order: [['createdAt', 'DESC']], include: [db.Users]}).then(function(allTweets){
			var data = {'user': req.session.uid.uid, 'da': allTweets};
			console.log(data.da);
			res.send(data);
		});
	});
}