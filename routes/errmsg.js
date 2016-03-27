exports.wrong = function(callback){
	console.log("Class errmsg and function wrong");
	var data = {};
	data['modal'] = 1;
	data['alert'] = 1;
	data['alerttype'] = "alert-notify-danger";
    callback(data);
}

exports.wrongwithmessage = function(callback){
	console.log("Class errmsg and function wrongwithmessage");
	var data = {};
	data['modal'] = 1;
	data['alert'] = 1;
	data['alerttype'] = "alert-notify-danger";
    data['message'] = "Something Went Wrong. Try Again!";
    callback(data);
}
