
/*
 * GET users listing.
 */
var errmsg = require('./errmsg');
var db = require('./datamodel');

//WARNING---- BY DEFAULT CODE---- DO NOT DELETE IT
exports.list = function(req, res){
  res.send("respond with a resource");
};

//User information
db.Users.hasMany(db.Tweet, { foreignKey: 'user_id' });
db.Users.hasMany(db.Follow, {foreignKey: 'following_id'});
db.Users.hasMany(db.Follow, {foreignKey: 'followers_id'});
function userInfo(req, res){
	console.log("Class user and function userInfo");
	db.Users.findOne({where: {'id': req.uid}}).then(function(ans){
		db.Follow.count({where: {'following_id': req.uid}}).then(function(followers){
			ans.dataValues['followers'] = followers;
			db.Follow.count({where: {'followers_id': req.uid}}).then(function(following){
				ans.dataValues['following'] = following;
				db.Tweet.count({where: {'user_id': req.uid}}).then(function(tweet){
					ans.dataValues['tweet'] = tweet;
					db.Likes.count({where: {'user_id': req.uid}}).then(function(likes){
						ans.dataValues['likes'] = likes;
						res(ans.dataValues);
					});
				})
			});
		});
	});
}

exports.profile = function(req, res){
	if(req.session.uid){
		userInfo(req.session.uid, function(userinfo){
//			console.log(req.params.id);
			newuser = {uid: req.params.id};
			userinfo['userid'] = req.params.id;
//			console.log(userinfo);
			userInfo(newuser, function(newuserinfo){
//				console.log("before");
				db.Follow.count({where: {'followers_id': req.params.id, 'following_id': req.session.uid.uid}}).then(function(followchk){
					console.log("After");
					console.log(followchk);
					userinfo['followchk'] = followchk;
					userinfo['us'] = newuserinfo;
					res.render('user', userinfo);
				});
			});
		});
	}else{
		res.render('index', { title: 'Express' });
	}
};

exports.userInfo = userInfo;