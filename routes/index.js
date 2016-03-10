
/*
 * GET home page.
 */
var db = require('./datamodel');
exports.index = function(req, res){
	
//	bCrypt.genSalt(8, hashcall);
//	function hashcall(err,res){
//		bCrypt.hash("aashay", res, null, gtf);
//	}
//	
//	function gtf(err, res){
//		console.log(res);
//		comp(res);
//	}
//	function comp(hash){
//		bCrypt.compare("bacon", hash, function(err, res) {
//		    console.log(res);
//		});
//	}
	console.log(req.sessionID);
	db.Sessions.findOne({where: {session_id: req.sessionID}, attributes: ['data']}).then(function(ans){
		console.log(ans.dataValues);
	});
	if(req.session.uid){
		res.render('home', { title: 'Express Home' });
	}else{
		res.render('index', { title: 'Express' });
	}
	
};