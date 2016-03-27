var mysql = require('./mysql');
var connection = mysql.getConnection();
var bcrypt = require('bcrypt');
var db = require('./datamodel');

exports.check = function(email,pass, callback){
	console.log("Class auth and function check");
//	console.log("values");
//	console.log(email);
//	console.log(pass);
	db.Users.findOne({where: {email: email}, attributes: ['id','pass']}).then(function(gethash){
		if(gethash){
			bcrypt.compare(pass, gethash.dataValues.pass, function(err, res) {
				if(res){
					
					db.Users.count({where: {email: email}}).then(function(co){
						console.log(co);
						if(co == 1){
							retdata = {
									'uid': gethash.dataValues.id,
									'ret': 'true'
							}
							callback(err,retdata);
						}else{
							callback(err,"fail");
						}
					})
				}else{
					callback(err,"fail");
				}
			});
		}else{
			callback(null,"fail");
		}
	});
//	var getUser = "select pass from user where email=?";
//	connection.query(getUser, email, function(err,res){
////		console.log(res);
//		if(err){
//			callback(err,"fail");
//		}else{
//			var jsonstr = JSON.stringify(res);
//			var jsonparse = JSON.parse(jsonstr);
//			if(jsonparse.length > 0){
//				check_hash(jsonparse[0].pass);
//			}else{
//				callback(err,"fail");
//			}
//		}
//	});
//	function check_hash(gethash){
//		console.log("Class auth and function check_hash");
////		console.log(gethash);
//		bcrypt.compare(pass, gethash, function(err, res) {
////			console.log("return value "+res);
//			if(res){
//				callback(err,"true");
//			}else{
//				callback(err,"fail");
//			}
//		});
//	}
	
}