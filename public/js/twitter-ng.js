var app = angular.module("twitter",[]);

app.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});

app.controller("twitterhash",function($scope, $http){

//	$scope.hashtag = function(){
//		$http({
//		});
//	}
//	angular.element('.center-home').hide();
//	$scope.hashtag();
});

app.controller("twitter",function($scope, $http, $location){
	//LOGOUT USER
	$scope.logout = function(){
		$http({
			method: 'POST',
			url: '/logout',
		}).then(function suc(val){
			if(val.data == "done"){
				window.location.assign('/');
			}
		});
	};
	$scope.tweetchar = function(){
		if($scope.tweet.length == 0 || $scope.tweet.length > 140){
			angular.element(".tweetsubmitbtn").addClass("disabled");
		}else{
			angular.element(".tweetsubmitbtn").removeClass("disabled");
		}
	};
	//SUBMIT TWEET
	$scope.tweetsubmit = function(){
		if($scope.tweet.length > 0 && $scope.tweet.length <= 140){
			data = {'tweet': $scope.tweet};
			$http({
				method: 'POST',
				url: '/tweet',
				dataType: "json",
				data: data
			}).then(function suc(val){
				if(val){
					angular.element("#tweetbox").modal('hide');
					alertline("alert-notify-success","<b>Tweet has been successfully posted</b>");
					angular.element(".stylish-input-group2").hide();
					angular.element(".stylish-input-group1").show();
					angular.element(".center-home .top").css('height', '55px');
					$scope.tweet = "";
					$scope.recenttweet();
					$scope.totalTweet += 1;
				}
				
			});
		}else{
			angular.element("#tweetbox").modal('hide');
			alertline("alert-notify-danger","<b>Tweet must have less than 140 character</b>");
		}
	};
	//GET RECENT TWEET
	$scope.recenttweet = function(){
		if(window.hashSearch){
			$scope.orm = 0;
			var url = "/hashtweet";
			var data = {'q': window.hashSearch}; 
		}else if(window.userid){
			$scope.orm = 0;
			var url = "/tweetbyuserid";
			var data = {'q': window.userid};
		}else{
			$scope.orm = 0;
			var url = "/recenttweet";
			var data = {'q': ""};
		}
			$http({
			method: 'POST',
			url: url,
			data: data,
			dataType: 'json'
		}).then(function(data){
//			console.log(data.data);
//			console.log(data.data.likes);
//			$scope.tweetlike = data.data.likes;
//			$scope.likeval = data.data.likes;
			if($scope.orm == 1){
				$scope.tweets = data.data.da;
			}else{
				$scope.tweets = data.data.da[0];
			}
//			console.log($scope.tweets);
//			console.log($scope.tweetlike);
			$scope.user = data.data.user;
			for(var i=0; i<$scope.tweets.length; i++){// Give all object of tweet
//				console.log($scope.tweets[i].tweet);
				var hashtag = [];
				if($scope.tweets[i].tweet != null && $scope.tweets[i].tweet != ""){
					var hashWithSpace = $scope.tweets[i].tweet.match(/(^#\w+| #\w+| #\w+)/g);
					if(hashWithSpace){
						hashWithSpace = hashWithSpace.getUnique(true);
						for(var j=0; j<hashWithSpace.length; j++){// Get hastag from tweet
							hashtag[j] = hashWithSpace[j].trim();
							$scope.tweets[i].tweet = $scope.tweets[i].tweet.replace(new RegExp(hashtag[j],'g'),"<a href='/hashtag/"+hashtag[j].substring(1)+"'>"+hashtag[j]+"<a/>");
						}
					}
				}
				if($scope.tweets[i].parent_tweet != null && $scope.tweets[i].parent_tweet != ""){
					var hashWithSpace = $scope.tweets[i].parent_tweet.match(/(^#\w+| #\w+| #\w+)/g);
					if(hashWithSpace){
						hashWithSpace = hashWithSpace.getUnique(true);
						for(var j=0; j<hashWithSpace.length; j++){// Get hastag from tweet
							hashtag[j] = hashWithSpace[j].trim();
							$scope.tweets[i].parent_tweet = $scope.tweets[i].parent_tweet.replace(new RegExp(hashtag[j],'g'),"<a href='/hashtag/"+hashtag[j].substring(1)+"'>"+hashtag[j]+"<a/>");
						}
					}
				}
				$scope.tweets[i].newdate = new Date($scope.tweets[i].createdAt); 
				$scope.tweets[i].nowdate = new Date();
				$scope.tweets[i].difference = parseInt($scope.tweets[i].nowdate - $scope.tweets[i].newdate); 
				var seconds = parseInt(($scope.tweets[i].difference)/1000);
				var minutes = parseInt(seconds/60);
				var hrs = parseInt(minutes/60);
				var days = parseInt(hrs/24);
				var months = parseInt(hrs/30);
				if(seconds > 60){
					if(minutes > 60){
						if(hrs > 24){
							if(days > 30){
								var time = months+"m";
							}else{
								var time = days+"d"; 
							}
						}else{
							var time = hrs+"h"; 
						}
					}else{
						var time = minutes+"m"; 
					}
				}else{
					var time = seconds+"s"; 
				}
				$scope.tweets[i].time = time;
			}
	//		console.log($scope.tweets);	
		});
	}
	
//	 }
	
	//DELETE TWEET
	$scope.deleteTweet = function(id){
		console.log(id);
		data = {'id': id};
		$http({
			method: 'POST',
			dataType: 'json',
			url: '/deletetweet',
			data: data
		}).then(function success(res){
			$scope.recenttweet();
			alertline("alert-notify-success","<b>Tweet has been successfully deleted</b>");
			$scope.totalTweet -= 1;
		});
	};
	

	//GET SEARCH SUGGESTION MADE BY ME
	var tempcheck = "";
	$scope.q ="";
	$scope.search = function(opt){
		var hashtag = 0;
		var handle = 0;
		if(opt == "focus"){
			tempcheck = "";
		}
		if($scope.q != tempcheck){
			var data = {'q': $scope.q};
			if($scope.q.charAt(0) == '#'){
				hashtag = 1;
			}else if($scope.q.charAt(0) == '@'){
				handle= 1;
			}
			$http({
				method: 'POST',
				dataType: 'json',
				url: '/suggest',
				data: data
			}).then(function success(res){
				if(hashtag == 1){
					$scope.availableTagsHashtag = res.data;
					angular.element('.for-drop').css("display","none");
					angular.element('.for-drop-hashtag').css("display","table");
				}else if(handle == 1){
					$scope.availableTags = res.data;
					angular.element('.for-drop').css("display","table");
				}else{
					$scope.availableTags = res.data;
					angular.element('.for-drop-hashtag').css("display","none");
					angular.element('.for-drop').css("display","table");
				}
				angular.element('.dropdown-toggle').dropdown();
				angular.element('.dropdown-toggle').css("display","table");
				tempcheck = $scope.q;
			});
			
		}
	};
	
	//REDIRECT TO USER PROFILE PAGE
	$scope.userRedirect= function(id){
		window.location.assign("/user/"+id);
	};
	
	//REDIRECT TO HASHTAG SEARCH
	$scope.hashtagRedirect = function(hashtag){
		window.location.assign("/hashtag/"+hashtag);
	}
	
	
	$scope.like = function(id,userlike,index,retweet){
		data = {'id': id};
//		console.log(index);
		$http({
			method: 'POST',
			url: '/like',
			data: data,
			dataType: 'json'
		}).then(function suc(reslike){
			if(reslike.data == true){
				if(retweet == 0){
					$scope.tweets[index].tweetlikes = Number($scope.tweets[index].tweetlikes) + 1;
					$scope.tweets[index].userlike = 1;
				}else{
					$scope.tweets[index].parent_tweet_likes_count = Number($scope.tweets[index].parent_tweet_likes_count) + 1;
					$scope.tweets[index].retweet_liked = 1;
				}
			}
			if(reslike.data == false){
				if(retweet == 0){
					$scope.tweets[index].tweetlikes = Number($scope.tweets[index].tweetlikes) - 1;
					$scope.tweets[index].userlike = 0;
				}else{
					$scope.tweets[index].parent_tweet_likes_count = Number($scope.tweets[index].parent_tweet_likes_count) - 1;
					$scope.tweets[index].retweet_liked = 0;
				}
			}
		});
	}
	
	//FOLLOW AND UNFOLLOW
	$scope.follow = function(followid, followChk){
		data = {'id': followid, 'followChk': followChk};
		console.log('go '+followChk);
		$http({
			method: 'POST',
			url: '/followid',
			data: data,
			dataType: 'json'
		}).then(function suc(followUserChk){
			console.log('return '+followUserChk.data);
			$scope.proffollowchk = followUserChk.data;
		});
	}
	
	//CHECK WHETHER SELECTED PROFILE IS OWNER,FOLLOWERS OR NOT(FOR BUTTONS)
	$scope.profilebtn = function(){
		if(window.userid == window.user_id){
//			$scope.profuser = 1;
		}else{
//			$scope.profuser = 0;
		}
		$scope.profuserid = window.userid;
		$scope.profuser_id = window.user_id;
		$scope.proffollowchk = window.followchk;
	}
	
	//UPDATE USER INFORMATION MODEL
	$scope.updateInfo = function(){
		$http({
			method: 'POST',
			url: '/userinfo'
		}).then(function suc(data){
			console.log(data);
			if(data.data.bday != null || data.data.bday != "" || data.data.bday != "0000-00-00"){
				bday = new Date(data.data.bday);
				data.data.bday = new Date(bday.getYear(),bday.getMonth(),bday.getDate()+1);
			}
//			console.log(new Date(data.data.bday).getYear());
			if(data.data.bday == "0000-00-00" || new Date(data.data.bday).getYear() == '69'){
				data.data.bday = null;
			}
//			console.log(data.data.bday);
			$scope.userinfo = data.data;
		});
	}
	
	$scope.addinfo = function(){
//		angular.element(".input_text_box").hide();
		angular.element(".input_text_box").removeClass("inputerr");
		angular.element(".ff-text-danger").remove();
		data = {'user': $scope.userinfo};
		$http({
			method: 'POST',
			url: '/addinfo',
			data: data,
			dataType: 'json'
		}).then(function suc(data){
			console.log(data.data);
			if(data.data.msg == 1){
				angular.forEach(data.data.message, function(i,item){
					angular.element("#"+item).addClass("inputerr");
					angular.element("#"+item).after("<div class=\'col-xs-12 ff-text-danger\'>"+i+"</div>");
				});
			}else{
				angular.element("#userinfo").modal("hide");
				alertline("alert-notify-success","<b>Saved contact information</b>");
			}
		});
	}
	
	//User Retweet
	$scope.retweet = function(user,userid,parent_id,retweet,index){
		if(user == userid){
			alertline("alert-notify-warning","<b>Can not retweet your own tweet</b>");
		}else{
			data = {'id': parent_id, 'retweet': retweet};
			$http({
				method: 'POST',
				url: '/retweet',
				data: data,
				dataType: 'json'
			}).then(function suc(res){
				if($scope.tweets[index].parent_tweet_retweet_count == null || $scope.tweets[index].parent_tweet_retweet_count == "");{
					$scope.tweets[index].parent_tweet_retweet_count = 0;
				}
				if(res.data == true){
					if(retweet == 0){
						$scope.tweets[index].parent_tweet_retweet_count = Number($scope.tweets[index].parent_tweet_retweet_count) + 1;
						$scope.tweets[index].retweeted = 1;
					}else{
						$scope.tweets[index].retweet_count = Number($scope.tweets[index].retweet_count) + 1;
						$scope.tweets[index].retweeted = 1;
					}
				}
				if(res.data == false){
					if(retweet == 0){
						$scope.tweets[index].parent_tweet_retweet_count = Number($scope.tweets[index].parent_tweet_retweet_count) - 1;
						$scope.tweets[index].retweeted = 0;
					}else{
						$scope.tweets[index].retweet_count = Number($scope.tweets[index].retweet_count) - 1;
						$scope.tweets[index].retweeted = 0;
					}
				}
				console.log(res.data);
				if(window.location.pathname.indexOf("/user") >= 0){
					
				}
				if(window.location.pathname.indexOf("/user") >= 0){
					
				}else{
//					$scope.recenttweet();
				}
				$scope.recenttweet();
				
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
	
	
	//CALL DEFAULT WHEN PAGE LOAD
	$scope.recenttweet();
	if(window.location.pathname.indexOf("/user") >= 0){
		$scope.profilebtn();
	}
});

// DIRECTIVE MADE IN ORDER TO APPLY JQUERY AFTER NG-REPEAT, HTTP
app.directive('searchRepeatDirective', function() {
	  return function(scope, element, attrs) {
		  element.hover(function (){
			  angular.element(this).find('.suggest-name').css("color","#fff");
			  angular.element(this).find('.suggest-handle').css("color","#fff");
			  angular.element(this).find('.suggest-hashtag').css("color","#fff");
		  },function () {
			  angular.element(this).find('.suggest-name').css("color","#292f33");
			  angular.element(this).find('.suggest-handle').css("color","#8899a6");
			  angular.element(this).find('.suggest-hashtag').css("color","#66757f");
		  });
	  };
});
app.directive('followBtn', function(){
	return function(scope, element, attrs) {
		element.hover(function (){
			angular.element(".btn-following").addClass("btn-unfollow");
    		angular.element(".btn-following").html("Unfollow");
		},function (){
			angular.element(".btn-following").removeClass("btn-unfollow");
			angular.element(".btn-following").html("Following");
		});
	};
});