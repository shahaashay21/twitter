var Sequelize = require('sequelize');
var errmsg = require('./errmsg');
var db = require('./datamodel');

//INSERT TWEET INTO DB
exports.ins = function(req, res){
	console.log("Class tweet and function ins");
	var handle =[];
	var hash = [];
	var tweet = req.param('tweet');
	var handleWithSpace = tweet.match(/(^@\w+| @\w+| @\w+)/g);
	if(handleWithSpace){
		for(var i=0; i<handleWithSpace.length; i++){
			tagWithhandle = handleWithSpace[i].trim();
			handle[i] = tagWithhandle.slice(1);
		}
	}
	
//	console.log(handle);
	var hashWithSpace = tweet.match(/(^#\w+| #\w+| #\w+)/g);
	if(hashWithSpace){
		for(var i=0; i<hashWithSpace.length; i++){
			tagWithHash = hashWithSpace[i].trim();
			hash[i] = tagWithHash.slice(1);
		}
	}
	hash = hash.getUnique(true);
//	console.log(hash);
	
	var hashdata = [];
	if(tweet.length == 0 || tweet.length > 140){
		res.send(JSON.string('fail'));
	}else{
		//GET NEXT ID
		db.sequelize.query("select get_nextid('tweet') as id;").spread(function(nextid,metadata){
			data = {};
			data['tweet'] = tweet;
			data['id'] = nextid[0].id;
			var nxid = nextid[0].id;
			data['user_id'] = req.session.uid.uid;
			//FIND OR CREATE NEW TWEET INTO DB
			db.Tweet.findOrCreate({where: {'id': data['id']}, defaults: data}).spread(function(user,created){
//				console.log(nxid);
				for(var i=0; i<hash.length; i++){
					hashdata[i] = {'tweet_id': nxid, 'user_id': req.session.uid.uid, 'hashtag': hash[i]};
				}
				if(hashdata.length > 0){
					//INSERT HASHTAG INTO TABLE IF AVAILABLE
					db.Hashtag.bulkCreate(hashdata).then(function(){
						res.json('Posted');
					});
				}else{
					res.json(created);
				}
			});
		});
	}
};

//SHOW RECENT TWEETS
exports.recentTweet = function(req,res){
	console.log("Class tweet and function recentTweet");
	var min = req.param('min');
	var bunch = req.param('bunch');
	db.Follow.findAll({where: {'followers_id': req.session.uid.uid}, attributes: ['following_id']}).then(function(following){
		followingIds = [];
		for(var i=0; i<following.length; i++){
			followingIds[i] = following[i].dataValues.following_id; 
		}
		followingIds[i] = req.session.uid.uid;
//		console.log(followingIds);
		db.Tweet.belongsTo(db.Users, {foreignKey:'user_id'});
		db.Tweet.hasMany(db.Likes, {foreignKey:'tweet_id'});
//		db.Tweet.findAll({where: {'user_id':{$in: followingIds}}, limit: 10, order: [['createdAt', 'DESC']], include: [db.Users]}).then(function(allTweets){
//		WITHOUT USERLIKE(CHECK USER HAS LIKED OR NOT)
//		WITHOUT RETWEET DATA
//		var query = "select sub2.*, ifnull(sub3.likecount,0) as userlike from (SELECT t.*, u.fname, u.lname, u.dp, u.tweet_handle, COUNT(l.id) AS tweetlikes FROM tweet AS t LEFT JOIN users AS u ON t.user_id = u.id LEFT JOIN likes AS l ON l.tweet_id = t.id WHERE t.user_id in ("+followingIds+") GROUP BY t.id) sub2 LEFT JOIN (SELECT tweet_id, count(*) as likecount from LIKES where user_id="+req.session.uid.uid+" group by tweet_id) as sub3 ON sub2.id= sub3.tweet_id ORDER BY sub2.createdAt DESC";
//		var query = "SELECT sub4.*, sub5.*, (CASE WHEN user_id = "+req.session.uid.uid+" and parent_id IS NOT NULL THEN 1 ELSE 0 END) AS retweeted, (CASE WHEN parent_tweet_user_id = "+req.session.uid.uid+" THEN 1 ELSE 0 END) AS myretweeted_tweet FROM (SELECT sub2.*, IFNULL(sub3.likecount, 0) AS userlike, IFNULL(tcount.original_tweet_count,0) as parent_tweet_retweet_count FROM (SELECT t.*, u.fname, u.lname, u.dp, u.tweet_handle, COUNT(l.id) AS tweetlikes FROM tweet AS t LEFT JOIN users AS u ON t.user_id = u.id LEFT JOIN likes AS l ON l.tweet_id = t.id WHERE t.user_id IN ("+followingIds+") GROUP BY t.id) sub2 LEFT JOIN (SELECT parent_id, COUNT(*) AS original_tweet_count FROM tweet GROUP BY parent_id) AS tcount ON tcount.parent_id = sub2.id LEFT JOIN (SELECT tweet_id, COUNT(*) AS likecount FROM LIKES WHERE user_id = "+req.session.uid.uid+" GROUP BY tweet_id) AS sub3 ON sub2.id = sub3.tweet_id ORDER BY sub2.createdAt) sub4 LEFT JOIN (SELECT parent_tweet.*, retweet_query.retweet_count AS retweet_count FROM (SELECT tweet.id AS parent_tweet_id, tweet.tweet AS parent_tweet, tweet.img_url AS parent_img_url, users.id AS parent_tweet_user_id, users.fname AS parent_tweet_user_fname, users.lname AS parent_tweet_user_lname, users.dp AS parent_tweet_user_dp, users.tweet_handle AS parent_tweet_user_tweet_handle, IFNULL(COUNT(likes.tweet_id), 0) AS parent_tweet_likes_count FROM tweet LEFT JOIN likes ON tweet.id = likes.tweet_id LEFT JOIN users ON tweet.user_id = users.id GROUP BY tweet.id) parent_tweet LEFT JOIN (SELECT parent_id AS retweet_id, IFNULL(COUNT(*), 0) AS retweet_count FROM twitter.tweet WHERE parent_id IS NOT NULL GROUP BY parent_id) retweet_query ON parent_tweet.parent_tweet_id = retweet_query.retweet_id) sub5 ON sub5.parent_tweet_id = sub4.parent_id ORDER BY sub4.createdAt DESC";
		var query = "SELECT sub6.*, (CASE WHEN likes.tweet_id IS NOT NULL THEN 1 ELSE 0 END) AS retweet_liked from (SELECT sub4.*, sub5.*, (CASE WHEN user_id = "+req.session.uid.uid+" and parent_id IS NOT NULL THEN 1 ELSE 0 END) AS retweeted, (CASE WHEN parent_tweet_user_id = "+req.session.uid.uid+" THEN 1 ELSE 0 END) AS myretweeted_tweet FROM (SELECT sub2.*, IFNULL(sub3.likecount, 0) AS userlike, IFNULL(tcount.original_tweet_count,0) as parent_tweet_retweet_count FROM (SELECT t.*, u.fname, u.lname, u.dp, u.tweet_handle, COUNT(l.id) AS tweetlikes FROM tweet AS t LEFT JOIN users AS u ON t.user_id = u.id LEFT JOIN likes AS l ON l.tweet_id = t.id WHERE t.user_id IN ("+followingIds+") GROUP BY t.id) sub2 LEFT JOIN (SELECT parent_id, COUNT(*) AS original_tweet_count FROM tweet GROUP BY parent_id) AS tcount ON tcount.parent_id = sub2.id LEFT JOIN (SELECT tweet_id, COUNT(*) AS likecount FROM LIKES WHERE user_id = "+req.session.uid.uid+" GROUP BY tweet_id) AS sub3 ON sub2.id = sub3.tweet_id ORDER BY sub2.createdAt) sub4 LEFT JOIN (SELECT parent_tweet.*, retweet_query.retweet_count AS retweet_count FROM (SELECT tweet.id AS parent_tweet_id, tweet.tweet AS parent_tweet, tweet.img_url AS parent_img_url, users.id AS parent_tweet_user_id, users.fname AS parent_tweet_user_fname, users.lname AS parent_tweet_user_lname, users.dp AS parent_tweet_user_dp, users.tweet_handle AS parent_tweet_user_tweet_handle, IFNULL(COUNT(likes.tweet_id), 0) AS parent_tweet_likes_count FROM tweet LEFT JOIN likes ON tweet.id = likes.tweet_id LEFT JOIN users ON tweet.user_id = users.id GROUP BY tweet.id) parent_tweet LEFT JOIN (SELECT parent_id AS retweet_id, IFNULL(COUNT(*), 0) AS retweet_count FROM twitter.tweet WHERE parent_id IS NOT NULL GROUP BY parent_id) retweet_query ON parent_tweet.parent_tweet_id = retweet_query.retweet_id) sub5 ON sub5.parent_tweet_id = sub4.parent_id ORDER BY sub4.createdAt DESC) sub6 LEFT JOIN likes ON parent_id = likes.tweet_id AND likes.user_id = "+req.session.uid.uid+" LIMIT 15";
		//LATEST ONE STILL NOT IMPLEMENTED
//		var query="select sub7.*, (CASE WHEN tweet.parent_id is not null then 1 else 0 end) as retweeted from (SELECT sub6.*, (CASE WHEN likes.tweet_id IS NOT NULL THEN 1 ELSE 0 END) AS retweet_liked from (SELECT sub4.*, sub5.*, (CASE WHEN user_id = "+req.session.uid.uid+" and parent_id IS NOT NULL THEN 1 ELSE 0 END) AS retweeted, (CASE WHEN parent_tweet_user_id = "+req.session.uid.uid+" THEN 1 ELSE 0 END) AS myretweeted_tweet FROM (SELECT sub2.*, IFNULL(sub3.likecount, 0) AS userlike, IFNULL(tcount.original_tweet_count,0) as parent_tweet_retweet_count FROM (SELECT t.*, u.fname, u.lname, u.dp, u.tweet_handle, COUNT(l.id) AS tweetlikes FROM tweet AS t LEFT JOIN users AS u ON t.user_id = u.id LEFT JOIN likes AS l ON l.tweet_id = t.id WHERE t.user_id IN ("+followingIds+") GROUP BY t.id) sub2 LEFT JOIN (SELECT parent_id, COUNT(*) AS original_tweet_count FROM tweet GROUP BY parent_id) AS tcount ON tcount.parent_id = sub2.id LEFT JOIN (SELECT tweet_id, COUNT(*) AS likecount FROM LIKES WHERE user_id = "+req.session.uid.uid+" GROUP BY tweet_id) AS sub3 ON sub2.id = sub3.tweet_id ORDER BY sub2.createdAt) sub4 LEFT JOIN (SELECT parent_tweet.*, retweet_query.retweet_count AS retweet_count FROM (SELECT tweet.id AS parent_tweet_id, tweet.tweet AS parent_tweet, tweet.img_url AS parent_img_url, users.id AS parent_tweet_user_id, users.fname AS parent_tweet_user_fname, users.lname AS parent_tweet_user_lname, users.dp AS parent_tweet_user_dp, users.tweet_handle AS parent_tweet_user_tweet_handle, IFNULL(COUNT(likes.tweet_id), 0) AS parent_tweet_likes_count FROM tweet LEFT JOIN likes ON tweet.id = likes.tweet_id LEFT JOIN users ON tweet.user_id = users.id GROUP BY tweet.id) parent_tweet LEFT JOIN (SELECT parent_id AS retweet_id, IFNULL(COUNT(*), 0) AS retweet_count FROM twitter.tweet WHERE parent_id IS NOT NULL GROUP BY parent_id) retweet_query ON parent_tweet.parent_tweet_id = retweet_query.retweet_id) sub5 ON sub5.parent_tweet_id = sub4.parent_id ORDER BY sub4.createdAt DESC) sub6 LEFT JOIN likes ON parent_id = likes.tweet_id AND likes.user_id = "+req.session.uid.uid+") sub7 left join tweet on sub7.parent_id = tweet.parent_id AND tweet.user_id = "+req.session.uid.uid;
		db.sequelize.query(query).then(function(allTweets){
//			db.Likes.findAll({attributes: [Sequelize.literal('COUNT(`tweet_id`) as likes'), 'tweet_id'], group: 'tweet_id', raw:true}).then(function(likes){
//				console.log(likes);
				allTweets['userid'] = req.session.uid.uid;
//				allTweets['likes'] = likes;
				var data = {'user': req.session.uid.uid, 'da': allTweets};
//				console.log(data.da);
				res.send(data);
//			});
		});
	});
};

//ALL TWEETS OF USER BY USERID
exports.tweetbyuserid = function(req,res){
	var userid = req.param('q');
//	var query = "select sub2.*, ifnull(sub3.likecount,0) as userlike from (SELECT t.*, u.fname, u.lname, u.dp, u.tweet_handle, COUNT(l.id) AS tweetlikes FROM tweet AS t LEFT JOIN users AS u ON t.user_id = u.id LEFT JOIN likes AS l ON l.tweet_id = t.id WHERE t.user_id in ("+userid+") GROUP BY t.id) sub2 LEFT JOIN (SELECT tweet_id, count(*) as likecount from LIKES where user_id="+req.session.uid.uid+" group by tweet_id) as sub3 ON sub2.id= sub3.tweet_id ORDER BY sub2.createdAt DESC";
	var query = "SELECT sub6.*, (CASE WHEN likes.tweet_id IS NOT NULL THEN 1 ELSE 0 END) AS retweet_liked from (SELECT sub4.*, sub5.*, (CASE WHEN user_id = "+req.session.uid.uid+" and parent_id IS NOT NULL THEN 1 ELSE 0 END) AS retweeted, (CASE WHEN parent_tweet_user_id = "+req.session.uid.uid+" THEN 1 ELSE 0 END) AS myretweeted_tweet FROM (SELECT sub2.*, IFNULL(sub3.likecount, 0) AS userlike, IFNULL(tcount.original_tweet_count,0) as parent_tweet_retweet_count FROM (SELECT t.*, u.fname, u.lname, u.dp, u.tweet_handle, COUNT(l.id) AS tweetlikes FROM tweet AS t LEFT JOIN users AS u ON t.user_id = u.id LEFT JOIN likes AS l ON l.tweet_id = t.id WHERE t.user_id IN ("+userid+") GROUP BY t.id) sub2 LEFT JOIN (SELECT parent_id, COUNT(*) AS original_tweet_count FROM tweet GROUP BY parent_id) AS tcount ON tcount.parent_id = sub2.id LEFT JOIN (SELECT tweet_id, COUNT(*) AS likecount FROM LIKES WHERE user_id = "+req.session.uid.uid+" GROUP BY tweet_id) AS sub3 ON sub2.id = sub3.tweet_id ORDER BY sub2.createdAt) sub4 LEFT JOIN (SELECT parent_tweet.*, retweet_query.retweet_count AS retweet_count FROM (SELECT tweet.id AS parent_tweet_id, tweet.tweet AS parent_tweet, tweet.img_url AS parent_img_url, users.id AS parent_tweet_user_id, users.fname AS parent_tweet_user_fname, users.lname AS parent_tweet_user_lname, users.dp AS parent_tweet_user_dp, users.tweet_handle AS parent_tweet_user_tweet_handle, IFNULL(COUNT(likes.tweet_id), 0) AS parent_tweet_likes_count FROM tweet LEFT JOIN likes ON tweet.id = likes.tweet_id LEFT JOIN users ON tweet.user_id = users.id GROUP BY tweet.id) parent_tweet LEFT JOIN (SELECT parent_id AS retweet_id, IFNULL(COUNT(*), 0) AS retweet_count FROM twitter.tweet WHERE parent_id IS NOT NULL GROUP BY parent_id) retweet_query ON parent_tweet.parent_tweet_id = retweet_query.retweet_id) sub5 ON sub5.parent_tweet_id = sub4.parent_id ORDER BY sub4.createdAt DESC) sub6 LEFT JOIN likes ON parent_id = likes.tweet_id AND likes.user_id = "+req.session.uid.uid;
//	var query="select sub7.*, (CASE WHEN tweet.parent_id is not null then 1 else 0 end) as retweeted from (SELECT sub6.*, (CASE WHEN likes.tweet_id IS NOT NULL THEN 1 ELSE 0 END) AS retweet_liked from (SELECT sub4.*, sub5.*, (CASE WHEN user_id = "+req.session.uid.uid+" and parent_id IS NOT NULL THEN 1 ELSE 0 END) AS retweeted, (CASE WHEN parent_tweet_user_id = "+req.session.uid.uid+" THEN 1 ELSE 0 END) AS myretweeted_tweet FROM (SELECT sub2.*, IFNULL(sub3.likecount, 0) AS userlike, IFNULL(tcount.original_tweet_count,0) as parent_tweet_retweet_count FROM (SELECT t.*, u.fname, u.lname, u.dp, u.tweet_handle, COUNT(l.id) AS tweetlikes FROM tweet AS t LEFT JOIN users AS u ON t.user_id = u.id LEFT JOIN likes AS l ON l.tweet_id = t.id WHERE t.user_id IN ("+userid+") GROUP BY t.id) sub2 LEFT JOIN (SELECT parent_id, COUNT(*) AS original_tweet_count FROM tweet GROUP BY parent_id) AS tcount ON tcount.parent_id = sub2.id LEFT JOIN (SELECT tweet_id, COUNT(*) AS likecount FROM LIKES WHERE user_id = "+req.session.uid.uid+" GROUP BY tweet_id) AS sub3 ON sub2.id = sub3.tweet_id ORDER BY sub2.createdAt) sub4 LEFT JOIN (SELECT parent_tweet.*, retweet_query.retweet_count AS retweet_count FROM (SELECT tweet.id AS parent_tweet_id, tweet.tweet AS parent_tweet, tweet.img_url AS parent_img_url, users.id AS parent_tweet_user_id, users.fname AS parent_tweet_user_fname, users.lname AS parent_tweet_user_lname, users.dp AS parent_tweet_user_dp, users.tweet_handle AS parent_tweet_user_tweet_handle, IFNULL(COUNT(likes.tweet_id), 0) AS parent_tweet_likes_count FROM tweet LEFT JOIN likes ON tweet.id = likes.tweet_id LEFT JOIN users ON tweet.user_id = users.id GROUP BY tweet.id) parent_tweet LEFT JOIN (SELECT parent_id AS retweet_id, IFNULL(COUNT(*), 0) AS retweet_count FROM twitter.tweet WHERE parent_id IS NOT NULL GROUP BY parent_id) retweet_query ON parent_tweet.parent_tweet_id = retweet_query.retweet_id) sub5 ON sub5.parent_tweet_id = sub4.parent_id ORDER BY sub4.createdAt DESC) sub6 LEFT JOIN likes ON parent_id = likes.tweet_id AND likes.user_id = "+req.session.uid.uid+") sub7 left join tweet on sub7.parent_id = tweet.parent_id AND tweet.user_id = "+req.session.uid.uid;
	db.sequelize.query(query).then(function(allTweets){
		var data = {'user': req.session.uid.uid, 'da': allTweets};
//		console.log(data.da);
		res.send(data);
	});
	
//	db.Tweet.belongsTo(db.Users, {foreignKey:'user_id'});
//	db.Tweet.findAll({where: {'user_id': userid}, limit: 10, order: [['createdAt', 'DESC']], include: [db.Users]}).then(function(allTweets){
//		var data = {'user': req.session.uid.uid, 'da': allTweets};
//		console.log(data.da);
//		res.send(data);
//	});
}

//DELETE TWEET FROM DB
exports.deleteTweet = function(req,res){
	console.log("Class tweet and function deleteTweet");
	var tweetid = req.param('id');
	db.Tweet.findOne({where: {'id': tweetid, 'user_id': req.session.uid.uid}}).then(function(singleTweet){
		if(singleTweet){
			db.Hashtag.destroy({where: {'tweet_id': tweetid, 'user_id': req.session.uid.uid}}).then(function(del){
				db.Likes.destroy({where: {'tweet_id': tweetid}}).then(function(dele){
					db.Tweet.destroy({where: {'id': tweetid, 'user_id': req.session.uid.uid}}).then(function(del){
						res.json(del);
					});
				});
			});
		}else{
			res.json("fail");
		}
	});
};

exports.like = function(req,res){
	id = req.param('id');
	db.sequelize.query("select get_nextid('likes') as id;").spread(function(nextid,metadata){
//		console.log(nextid[0].id);
		data = {};
		data['id'] = nextid[0].id;
		data['user_id'] = req.session.uid.uid;
		data['tweet_id'] = id;
		db.Likes.findOrCreate({where: {'user_id': req.session.uid.uid, 'tweet_id': id}, defaults: data, raw:true}).then(function(create){
			if(create[1] == true){
				res.send(create[1]);
			}else{
				db.Likes.destroy({where: {'user_id': req.session.uid.uid, 'tweet_id': id}}).then(function(del){
					res.send(create[1]);
				});			
			}
		});
	});
}


//GIVE SUGGESTION ON BASED ON NAME, TWEET_HANDLE AND HASHTAG
exports.suggest = function(req,res){
	var q = req.param('q');
	if(q.charAt(0) == '#'){
		q = q.substring(1);
		db.Hashtag.findAll({where: {'hashtag': {$like: q+'%'}}, limit: 5, attributes: [Sequelize.literal('DISTINCT `hashtag`'), 'hashtag']}).then(function(qans){
			res.json(qans);
		})
	}else if(q.charAt(0) == '@'){
		q = q.substring(1);
		db.Users.findAll({where: {'tweet_handle': {$like: q+'%'}}, limit: 5 }).then(function(qans){
			res.json(qans);
		});
	}else{
		db.Users.findAll({where: {'fname': {$like: q+'%'}}, limit: 5 }).then(function(qans){
			res.json(qans);
		});
	}
}

//Retweet
exports.retweet = function(req,res){
	tweetid = req.param('id');
//	console.log(tweetid);
	db.Tweet.count({where: {'user_id': req.session.uid.uid, 'parent_id': tweetid}, raw:true}).then(function(co){
		if(co > 0){
			db.Tweet.destroy({where: {'user_id': req.session.uid.uid, 'parent_id': tweetid}, raw:true}).then(function(co){
				res.json(false);
			});
		}else{
			db.sequelize.query("select get_nextid('tweet') as id;").spread(function(nextid,metadata){
				db.Tweet.create({'parent_id':tweetid, 'user_id': req.session.uid.uid, 'id': nextid[0].id}).then(function(create){
					res.json(true);
				});
			});
		}
	});
//	res.json(tweetid);
}


//GET UNIQUE ARRAY
Array.prototype.getUnique = function (createArray) {
    createArray = createArray === true ? true : false;
    var temp = JSON.stringify(this);
    temp = JSON.parse(temp);
    if (createArray) {
        var unique = temp.filter(function (elem, pos) {
            return temp.indexOf(elem) == pos;
        }.bind(this));
        return unique;
    }
    else {
        var unique = this.filter(function (elem, pos) {
            return this.indexOf(elem) == pos;
        }.bind(this));
        this.length = 0;
        this.splice(0, 0, unique);
    }
}
