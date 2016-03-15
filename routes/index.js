
/*
 * GET home page.
 */
var db = require('./datamodel');
var user = require('./user');
exports.index = function(req, res){
	
//	console.log(req.sessionID);
////	db.Sessions.findOne({where: {session_id: req.sessionID}, attributes: ['data']}).then(function(ans){
////		console.log(ans.dataValues);
////	});
//	db.Tweet.belongsTo(db.Users, {foreignKey: 'user_id'});
//	db.Users.hasOne(db.Tweet, {foreignKey: 'user_id'});
//	
//	db.Tweet.findAll( {include: [db.Users]}).then(function(ans){
////		console.log(ans[0].dataValues.user.dataValues);
//	});
//	
//	db.Users.findAll( {include: [db.Tweet]}).then(function(ans){
//		console.log(ans[1].dataValues);
//	});
	if(req.session.uid){
		user.userInfo(req.session.uid, function(userinfo){
//			console.log(userinfo);
			res.render('home', userinfo);
		});
		
	}else{
		res.render('index', { title: 'Express' });
	}
	
};