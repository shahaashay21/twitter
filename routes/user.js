
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
exports.userInfo = function(req, res){
	console.log("Class user and function userInfo");
	db.Users.findOne({where: {'id': req.uid}}).then(function(ans){
		db.Follow.count({where: {'following_id': req.uid}}).then(function(followers){
			ans.dataValues['followers'] = followers;
			db.Follow.count({where: {'followers_id': req.uid}}).then(function(following){
				ans.dataValues['following'] = following;
				db.Tweet.count({where: {'user_id': req.uid}}).then(function(tweet){
					ans.dataValues['tweet'] = tweet;
					res(ans.dataValues);
				})
			});
		});
	});
	
}