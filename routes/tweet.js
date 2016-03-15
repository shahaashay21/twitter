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
	console.log(hash);
	
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
				console.log(nxid);
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
		console.log(followingIds);
		db.Tweet.belongsTo(db.Users, {foreignKey:'user_id'});
		db.Tweet.findAll({where: {'user_id':{$in: followingIds}}, limit: 10, order: [['createdAt', 'DESC']], include: [db.Users]}).then(function(allTweets){
//			allTweets['userid'] = req.session.uid.uid;
			var data = {'user': req.session.uid.uid, 'da': allTweets};
//			console.log(data);
			res.send(data);
		});
	});
};

//DELETE TWEET FROM DB
exports.deleteTweet = function(req,res){
	console.log("Class tweet and function deleteTweet");
	var tweetid = req.param('id');
	db.Tweet.findOne({where: {'id': tweetid, 'user_id': req.session.uid.uid}}).then(function(singleTweet){
		if(singleTweet){
			db.Hashtag.destroy({where: {'tweet_id': tweetid, 'user_id': req.session.uid.uid}}).then(function(del){
				db.Tweet.destroy({where: {'id': tweetid, 'user_id': req.session.uid.uid}}).then(function(del){
					res.json(del);
				});
			});
		}else{
			res.json("fail");
		}
	});
};

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
