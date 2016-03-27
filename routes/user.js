
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
				db.Follow.count({where: {'following_id': req.params.id, 'followers_id': req.session.uid.uid}}).then(function(followchk){
//					console.log("After");
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

exports.follow = function(req,res){
	var id = req.param('id');
	var followChk = req.param('followChk');
	if(followChk == 1){
		//Destroy
		db.Follow.destroy({where: {'following_id': id, 'followers_id': req.session.uid.uid}}).then(function(del){
			followChk = 0;
			res.json(followChk);
		});
	}else{
		//Create
		db.sequelize.query("select get_nextid('follow') as id;").spread(function(nextid,metadata){
			db.Follow.create({'id': nextid[0].id, 'following_id': id, 'followers_id': req.session.uid.uid}).then(function(created){
				followChk = 1;
				res.json(followChk);
			})
		});
	}
};

exports.userinfo = function(req,res){
	db.Users.findOne({where: {'id': req.session.uid.uid}, attributes: ['id','fname','lname','email','bday','tweet_handle','contact','location']}).then(function(userinfo){
		res.send(userinfo);
	});
};

exports.addinfo = function(req,res){
	user = req.param('user');
//	console.log(user);
	message = {};
	msgchk = 0;
	if(user.fname == "" || user.fname == null){
		message['us-fname'] = "First name field is required";
		msgchk = 1;
	}
	if(user.lname == "" || user.lname == null){
		message['us-lname'] = "Last name field is required";
		msgchk = 1;
	}
	if(isNaN(user.contact)){
		message['us-contact'] = "Wrong contact information";
		msgchk = 1;
	}
	if(user.tweet_handle != "" && user.tweet_handle != null){
		db.Users.count({where: {'tweet_handle': user.tweet_handle, id:{$ne: user.id}}, raw: true}).then(function(handlecount){
//			console.log(handlecount);
			if(handlecount > 0){
//				console.log('in here');
				message['us-handle'] = "Tweet Handle has already been taken";
				msgchk = 1;
			}
			if(msgchk == 1){
				data = {'message': message, 'msg': 1};
				res.send(data);
			}else{
				if(user.bday != "" || user.bday != null){
					user.bday = new Date(user.bday);
				}
				db.Users.update(user,{where: {'id': user.id}, raw:true}).then(function(update){
					if(update[0] == 1){
						dataa = {'msg': 0};
						res.send(dataa);
					}
				});
			}
		});
	}else{
		if(msgchk == 1){
			data = {'message': message, 'msg': 1};
			res.send(data);
		}else{
//			console.log(user.bday);
			if(user.bday != "" || user.bday != null){
				user.bday = new Date(user.bday);
			}
			db.Users.update(user,{where: {'id': user.id}, raw:true}).then(function(update){
				if(update[0] == 1){
					dataa = {'msg': 0};
					res.send(dataa);
				}
			});
		}
	}
	
}

exports.userInfo = userInfo;