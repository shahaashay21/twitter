var mysql = require('./mysql');
var connection = mysql.getConnection();
var bcrypt = require('bcrypt');
var auth = require('./auth');
var errmsg = require('./errmsg');
var db = require('./datamodel');
exports.loginUser = function(req, res){
	console.log("Class Login and function loginUser");
	var email = req.param('email-login');
	var pass = req.param('pass-login');
	 
	 auth.check(email,pass ,function(err, resa){
		 if(err){
			 errmsg.wrongwithmessage(function(data){
				res.end(JSON.stringify(data));
			});
		 }else{
//			 console.log('ALWAYS HERE');
			 console.log(resa);
			 if(resa.uid){
				 req.session.uid = resa;
				 res.end(JSON.stringify('pass')); 
			 }else{
				 res.end(JSON.stringify('fail'));
			 }
		 }
	 });

};

exports.registerUser = function(req,res){
	console.log("Class Login and function registerUser");
//	db.Users.sync();
	var email = req.param('email');
	var pass = req.param('pass');
	var fname = req.param('fname');
	var lname = req.param('lname');
//	ENCRYPT PASSWORD USING BCRYPT
	bcrypt.hash(pass, 5, function(err, hash) {
//		GET NEXT USER ID FROM MYSQL FUNCTION
		db.sequelize.query("select get_nextid('users') as id;").spread(function(nextid,metadata){
			da = {};
			da['email'] = email;
			da['pass'] = hash;
			da['fname'] = fname;
			da['lname'] = lname;
			da['id'] = nextid[0].id;
//			CHECK USER IS ALREADY AVAILABLE OR NOT IF NOT THEN CREATE USER
			db.Users.findOrCreate({where: {email: email}, defaults: da})
				.spread(function(user,created){
					if(created){
						res.end(JSON.stringify('Registered'));
					}else{
						res.end(JSON.stringify('available'));
					}
				
			});
		});
	});
	
//	db.Users.findAll({}).then(function(ans){
////		console.log(ans);
//	});
};

//exports.registerUsera = function(req,res){
//	console.log("Class Login and function registerUser");
//	var email = req.param('email');
//	var pass = req.param('pass');
//	var fname = req.param('fname');
//	var lname = req.param('lname');
//	var qchkuser = "select count(*) as usercount from users where email=?";
//	var data = [];
//	//CHECK USER IS ALREADY AVAILABLE OR NOT
//	connection.query(qchkuser,email,function(err, res){
//		//ENCRYPT PASSWORD USING BCRYPT
//		if(err){
//			errmsg.wrongwithmessage(function(data){
//				res.end(JSON.stringify(data));
//			});
//		}else{
//			bcrypt.hash(pass, 5, function(err, hash) {
//				if(err){
//					errmsg.wrongwithmessage(function(data){
//						res.end(JSON.stringify(data));
//					});
//				}else{
//	//				console.log("IN HASH");
//	//		    	console.log(hash);
//			    	var insertuser = "insert into users set ?";
//			    	var qnextid = "select get_nextid('users') as id;";
//			    	//GET NEXT USER ID FROM MYSQL FUNCTION
//			    	connection.query(qnextid, function(err, nextid){
//			    		if(err){
//			    			errmsg.wrongwithmessage(function(data){
//			    				res.end(JSON.stringify(data));
//			    			});
//			    		}else{
//	//			    		console.log(nextid[0].id);
//				    		var data = {
//				    				email: email,
//				    				pass: hash,
//				    				fname: fname,
//				    				lname: lname,
//				    				id: nextid[0].id
//				    		}
//				    		//INSERT DATA INTO USER TABLE
//				    		connection.query(insertuser,data, function(req,res){
//				    			if(err){
//				    				errmsg.wrongwithmessage(function(data){
//				    					res.end(JSON.stringify(data));
//				    				});
//				    			}else{
//				    				console.log(res);
//				    			}
//				    		});
//			    		}
//			    	});
//				}
//			});
//		}
//	});
//		
//};

exports.logOut = function(req,res){
	req.session.destroy(function(err) {
//		sessionStore.closeStore();
		res.json("done");
	});
};
